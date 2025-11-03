// supabase/functions/create-tenant/index.ts

// FIX: Corrected the Deno types reference to a more stable, unversioned URL as recommended by Supabase docs. This should prevent type loading issues that cause Deno.env to be undefined, leading to function failure and incomplete user setup.
/// <reference types="https://cdn.jsdelivr.net/npm/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// These are mock permissions for default roles
const adminPermissions = ['manage_pos', 'manage_inventory', 'manage_staff', 'manage_branches', 'view_reports', 'access_settings', 'manage_logistics', 'manage_invoicing', 'manage_credit', 'view_activity_log', 'manage_automations', 'process_returns'];
const managerPermissions = ['manage_pos', 'manage_inventory', 'view_reports', 'process_returns'];
const accountantPermissions = ['view_reports', 'manage_invoicing', 'manage_credit', 'view_activity_log'];
const cashierPermissions = ['manage_pos', 'process_returns'];


serve(async (req) => {
  try {
    const { record: user } = await req.json()

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    // 1. Create a new Tenant
    const { data: tenantData, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert({ 
        company_name: user.raw_user_meta_data.company_name || `${user.email}'s Team`,
        email: user.email,
        owner_id: user.id
      })
      .select()
      .single();

    if (tenantError) throw tenantError;

    // 2. Create a default subscription (e.g., 'pro' plan trial)
    const trialEnds = new Date();
    trialEnds.setDate(trialEnds.getDate() + 30);
    const { error: subError } = await supabaseAdmin
        .from('user_subscriptions')
        .insert({
            tenant_id: tenantData.id,
            plan_id: 'pro', // default trial plan
            status: 'trial',
            trial_ends: trialEnds.toISOString(),
            billing_cycle: 'monthly'
        });
    if (subError) throw subError;

    // 3. Create default roles for the new tenant
    const defaultRoles = [
      { tenant_id: tenantData.id, name: 'Admin', permissions: adminPermissions },
      { tenant_id: tenantData.id, name: 'Manager', permissions: managerPermissions },
      { tenant_id: tenantData.id, name: 'Accountant', permissions: accountantPermissions },
      { tenant_id: tenantData.id, name: 'Cashier', permissions: cashierPermissions }
    ];
    const { data: rolesData, error: rolesError } = await supabaseAdmin
      .from('tenant_roles')
      .insert(defaultRoles)
      .select();
    if (rolesError) throw rolesError;

    const adminRole = rolesData.find(r => r.name === 'Admin');
    if (!adminRole) throw new Error("Failed to find admin role after creation.");

    // 4. Create a default branch
    const { data: branchData, error: branchError } = await supabaseAdmin
        .from('branches')
        .insert({
            tenant_id: tenantData.id,
            name: 'Main Branch',
            address: '123 Business Avenue',
            status: 'active'
        })
        .select()
        .single();
    if (branchError) throw branchError;

    // 5. Create the staff profile for the user who signed up
    const { error: staffError } = await supabaseAdmin
      .from('staff')
      .insert({
        id: user.id, // Use user's auth id as staff id
        tenant_id: tenantData.id,
        name: user.raw_user_meta_data.company_name || user.email,
        email: user.email,
        username: user.email,
        role_id: adminRole.id,
        branch: branchData.name,
        status: 'active'
      });
    if (staffError) throw staffError;

    // Update user's app_metadata with tenant_id and role for RLS
    const { error: userUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { app_metadata: { tenant_id: tenantData.id, role: 'Admin' } }
    )
    if(userUpdateError) throw userUpdateError;

    return new Response(JSON.stringify({ tenant: tenantData }), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})