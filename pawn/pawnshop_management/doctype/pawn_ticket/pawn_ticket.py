# Copyright (c) 2021, MPFS and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class PawnTicket(Document):
	def validate(self):
		self.validate_no_of_items()
		self.validate_pawn_type()

	def validate_no_of_items(self):
		if len(self.pawn_ticket_items) > 5:
			frappe.throw("Only 5 items are allowed per pawn ticket.")

	def validate_pawn_type(self):
		for line in self.pawn_ticket_items:
			if self.pawn_type != line.pawn_type:
				frappe.throw("All pawn items must be of {0} type.".format(self.pawn_type))

	def on_submit(self):
		self.set_status_to_pawned()

	def set_status_to_pawned(self):
		for line in self.pawn_ticket_items:
			frappe.db.set_value('Pawn Item', line.pawn_item, 'pawn_status', 'Pawned')

	def on_cancel(self):
		self.set_status_to_new()

	def set_status_to_new(self):
		for line in self.pawn_ticket_items:
			frappe.db.set_value('Pawn Item', line.pawn_item, 'pawn_status', 'New')

