

import React, { useState, useEffect, useMemo } from 'react';
import { CreditCard, PlusCircle, Edit, Trash2, Loader, DollarSign, Users } from 'lucide-react';
import { SubscriptionPlan, ActiveSubscription } from '../../types';
import SubscriptionPlanModal from '../../components/superadmin/SubscriptionPlanModal';
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient';
import { subscriptionPlans as mockPlans, activeSubscriptions as mockActiveSubscriptions } from '../../data/mockData';
import Tabs from '../../components/ui/Tabs';
import Table, { Column } from '../../components/ui/Table';
import { formatCurrency } from '../../utils/formatting';
import DashboardCard from '../../components/dashboard/DashboardCard';

const getStatusBadge = (status: ActiveSubscription['status']) => {
    switch (status) {
        case 'active': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full capitalize">{status}</span>;
        case 'trial': return <span className="px-2 py-1 text-xs font-medium text-blue-300 bg-blue-900 rounded-full capitalize">{status}</span>;
        case 'expired': return <span className="px-2 py-1 text-xs font-medium text-red-300 bg-red-900 rounded-full capitalize">{status}</span>;
    }
};

const ActiveSubscriptionsTab: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<ActiveSubscription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetching
        setTimeout(() => {
            setSubscriptions(mockActiveSubscriptions);
            setLoading(false);
        }, 500);
    }, []);

    const totalMrr = useMemo(() => subscriptions.reduce((sum, sub) => sum + sub.mrr, 0), [subscriptions]);

    const columns: Column<ActiveSubscription>[] = [
        { header: 'Tenant', accessor: 'tenantName', sortable: true },
        { header: 'Plan', accessor: 'planName', sortable: true },
        { header: 'Status', accessor: 'status', sortable: true, render: (row) => getStatusBadge(row.status) },
        { header: 'MRR', accessor: 'mrr', sortable: true, render: (row) => formatCurrency(row.mrr, 'USD') },
        { header: 'Next Billing Date', accessor: 'nextBillingDate' as any, sortable: true, render: (row) => row.nextBillingDate ? new Date(row.nextBillingDate).toLocaleDateString() : 'N/A' },
    ];
    
    return (
        <div className="space-y-6">
            <DashboardCard 
                title="Total Monthly Recurring Revenue (MRR)" 
                value={formatCurrency(totalMrr, 'USD')} 
                change={`${subscriptions.filter(s => s.status === 'active' || s.status === 'expired').length} paying customers`} 
                icon={<DollarSign className="text-green-500" />} 
            />
            <Table columns={columns} data={subscriptions} isLoading={loading} />
        </div>
    );
};

const PlanManagementTab: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | undefined>(undefined);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
        if (!isSupabaseConfigured) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setPlans(mockPlans);
        } else {
          const { data, error } = await supabase.from('subscription_plans').select('*').order('price');
          if (error) throw error;
          const formattedData = data.map(p => ({
              ...p,
              branchLimit: p.branch_limit,
              userLimit: p.user_limit,
          }));
          setPlans(formattedData);
        }
    } catch (err) {
        setError('Failed to fetch subscription plans.');
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openModalForEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingPlan(undefined);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(undefined);
  };
  
  const handleSavePlan = async (plan: SubscriptionPlan) => {
    if (isSupabaseConfigured) {
      const planPayload = {
          name: plan.name,
          price: plan.price,
          description: plan.description,
          features: plan.features,
          branch_limit: plan.branchLimit,
          user_limit: plan.userLimit
      };
      if (editingPlan) {
        const { error } = await supabase.from('subscription_plans').update(planPayload).eq('id', plan.id);
        if (error) {
            alert('Failed to update plan: ' + error.message);
            return;
        }
      } else {
        const { error } = await supabase.from('subscription_plans').insert(planPayload);
        if (error) {
            alert('Failed to create plan: ' + error.message);
            return;
        }
      }
      fetchPlans();
    } else {
      if (editingPlan) {
        setPlans(plans.map(p => p.id === plan.id ? plan : p));
      } else {
        const newPlan = { ...plan, id: `plan_${new Date().getTime()}` };
        setPlans([...plans, newPlan].sort((a,b) => a.price - b.price));
      }
    }
    closeModal();
  };
  
  const handleDeletePlan = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
        if (isSupabaseConfigured) {
            const { error } = await supabase.from('subscription_plans').delete().eq('id', id);
            if (error) {
                alert('Failed to delete plan.');
                return;
            }
        }
        setPlans(plans.filter(p => p.id !== id));
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
         <button onClick={openModalForNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            <PlusCircle size={16} /> Create Plan
        </button>
      </div>
       {loading ? (
        <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-primary" size={40}/></div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-400">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map(plan => (
                <div key={plan.id} className="bg-surface border border-border rounded-xl p-6 shadow-lg flex flex-col">
                    <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-primary">{plan.name}</h3>
                        <p className="text-text-secondary text-sm my-2">{plan.description}</p>
                        <div className="my-4">
                            <span className="text-4xl font-extrabold text-text-primary">${plan.price}</span>
                            <span className="text-text-secondary">/ month</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-text-secondary">✓ <span className="text-text-primary">{feature}</span></li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-6 border-t border-border pt-4 flex justify-end gap-2">
                        <button onClick={() => openModalForEdit(plan)} className="flex items-center gap-2 bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
                            <Edit size={14} /> Edit
                        </button>
                        <button onClick={() => handleDeletePlan(plan.id)} className="flex items-center gap-2 bg-red-600/20 text-red-400 hover:bg-red-600/40 font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}
       {isModalOpen && (
        <SubscriptionPlanModal
            plan={editingPlan}
            onClose={closeModal}
            onSave={handleSavePlan}
        />
      )}
    </>
  );
};


const SubscriptionsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('subscriptions');
    const tabs = [
        { id: 'subscriptions', label: 'Active Subscriptions', icon: <Users size={16}/> },
        { id: 'plans', label: 'Plan Management', icon: <CreditCard size={16}/> }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Subscriptions</h1>
            
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="mt-6">
                    {activeTab === 'subscriptions' && <ActiveSubscriptionsTab />}
                    {activeTab === 'plans' && <PlanManagementTab />}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionsPage;