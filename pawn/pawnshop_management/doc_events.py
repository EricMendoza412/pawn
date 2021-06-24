import frappe
from frappe.utils import formatdate, cint

def customer_validate(customer, method):
    set_customer_no(customer)    

def set_customer_no(customer):
    if not customer.customer_no:    
        branch_code = frappe.db.get_value('Branch', customer.branch, 'branch_code')
        
        count = cint(frappe.db.count('Customer', {'branch':customer.branch}))
        next_number = count + 1

        creation_date = formatdate(customer.creation, "yyymmdd")

        customer.customer_no = "{0}-{1}-{2}".format(branch_code, next_number, creation_date)