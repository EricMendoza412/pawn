import frappe 

@frappe.whitelist(allow_guest=True)
def test_method(name):
    return "hello {0}".format(name)