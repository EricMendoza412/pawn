import frappe

def get_context(context):
    user = frappe.session.user

    customers = frappe.db.get_list('Customer')

    context.user = user
    context.customers = customers
    
    return context