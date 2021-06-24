// Copyright (c) 2021, MPFS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Pawn Ticket', {
	 refresh: function(frm) {
	// set filters for Link field item_code in
	// items field which is a Child Table
		frm.set_query('pawn_item', 'pawn_ticket_items', () => {
    	return {
        	filters: {
            'pawn_type': frm.doc.pawn_type
        	}
    	}
		})


	},
   onload(frm){

		cur_frm.set_value('date_l',frappe.datetime.now_date());
   
	},

	date_l: function(frm){

		let default_maturity_date = frappe.datetime.add_days(cur_frm.doc.date_l, 30);
		cur_frm.set_value('maturity_date', default_maturity_date);

		let default_expiry_date = frappe.datetime.add_days(cur_frm.doc.date_l, 120);
		cur_frm.set_value('expiry_date', default_expiry_date);

	},

	principal: function(frm){
		//let interest = cur_frm.doc.principal * 0.05;
		//cur_frm.set_value('interest', interest);

		//let net_proceeds = cur_frm.doc.principal - interest;
		//cur_frm.set_value('net_proceeds', net_proceeds);
	},

	set_totals: function(frm){
		let temp_principal = 0.00;

		$.each(frm.doc.pawn_ticket_items, function(index, item){
			temp_principal += parseFloat(item.appraised_amount);
		});

		frm.set_value('principal', temp_principal);

		frappe.db.get_single_value('Pawnshop Settings', 'jewelry_interest_rate').then(value => {
			let temp_interest = (parseFloat(value) / 100) * temp_principal;
			console.log("check "+ temp_interest);
			frm.set_value('interest', temp_interest);
			frm.set_value('net_proceeds', temp_principal - temp_interest);

		});

		//frappe.db.get_value('Pawnshop Management Settings');


		frappe.show_alert("Principal updated",5);
	}


});


frappe.ui.form.on('Pawn Ticket Item', {
    // cdt is Child DocType name i.e Quotation Item
    // cdn is the row name for e.g bbfcb8da6a

	appraised_amount(frm, cdt, cdn) {
       // console.log("test");
		frm.trigger('set_totals');
    },

	pawn_ticket_items_remove: function(frm){
		frm.trigger('set_totals');

	}



});


