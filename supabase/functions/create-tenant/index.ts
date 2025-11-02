// FIX: Add a triple-slash directive to reference Deno's types.
/// <reference types="https://deno.land/x/deno/types/index.d.ts" />

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const { record: user } = await req.json();

    if (!user || !user.id || !user.email) {
      throw new Error("User data is missing in the webhook payload.");
    }
    
    const companyName = user.raw_user_meta_data?.company_name || `My Business`;

    // 1. Create a new tenant
    const { data: tenantData, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert({
        owner_id: user.id,
        company_name: companyName,
        email: user.email,
        plan_id: 'pro', // Default to 'pro' plan on trial
        status: 'trial',
        subscription_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30-day trial
      })
      .select('id')
      .single();

    if (tenantError) throw tenantError;
    const newTenantId = tenantData.id;

    // 2. Create default roles for the new tenant
    const { data: roleData, error: roleError } = await supabaseAdmin
        .from('tenant_roles')
        .insert([
            { tenant_id: newTenantId, name: 'Admin', permissions: ['manage_pos', 'manage_inventory', 'manage_staff', 'manage_branches', 'manage_automations', 'view_reports', 'process_returns', 'access_settings', 'manage_logistics', 'manage_invoicing', 'manage_credit', 'view_activity_log']},
            { tenant_id: newTenantId, name: 'Manager', permissions: ['manage_pos', 'manage_inventory', 'manage_staff', 'view_reports', 'process_returns']},
            { tenant_id: newTenantId, name: 'Cashier', permissions: ['manage_pos', 'process_returns']}
        ])
        .select('id, name')
        .limit(1); // Get the Admin role ID

    if (roleError) throw roleError;
    const adminRoleId = roleData.find(r => r.name === 'Admin')?.id;
    if (!adminRoleId) throw new Error("Could not find admin role after creation.");

    // 3. Create a staff entry for the new user, making them an admin
    const { error: staffError } = await supabaseAdmin
      .from('staff')
      .insert({
        user_id: user.id,
        tenant_id: newTenantId,
        name: user.raw_user_meta_data?.full_name || 'Admin User',
        role_id: adminRoleId
      });

    if (staffError) throw staffError;

    // 4. Update the user's app_metadata in auth.users
    const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { app_metadata: { tenant_id: newTenantId, role: 'Admin' } }
    );

    if (updateUserError) throw updateUserError;

    return new Response(JSON.stringify({ message: `Tenant for ${user.email} created successfully.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in create-tenant function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
