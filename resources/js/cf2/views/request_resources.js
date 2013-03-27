Atmo.Views.RequestResourcesModal = Backbone.View.extend({
    id: 'request_resources_modal',
    className: 'modal hide fade',
    template: _.template(Atmo.Templates.request_resources),
	events: {
		'click #request_resources_btn' : 'request_resources'
	},
    initialize: function() {
    },
    render: function() {
		this.$el.html(this.template(Atmo.profile));

        return this;
    },
    do_alert: function() {
		var self = this;

        this.$el.modal({
            backdrop: true,
            keyboard: true
        });

        this.$el.find('.modal-header button').click(function() {
            this.$el.modal('hide');
        });

        this.$el.modal('show');

        $(window).on('keyup', function(e) {

            // Only confirm if user does not have cursor in a textarea
            if (e.keyCode == 13 && $('textarea:focus').length == 0) {
                this.$el.find('.modal-footer a').eq(1).trigger('click');
            }
        });
        
        this.$el.find('.modal-footer a').show();
        this.$el.find('.modal-footer a').eq(0).click(function() { self.button_listener() });
    },
	button_listener: function(callback) {
		var self = this;

		self.$el.modal('hide');
		$('.modal-backdrop').remove();
		if (callback != undefined) 
			callback();
		$(window).unbind('keyup');

		this.render();		// Prepare form for next launch
	},
	request_resources: function(e) {
		var data = {};
		var self = this;


		var quota = this.$el.find('textarea[name="quota"]');
		var reason = this.$el.find('textarea[name="reason"]');

		// Error handling: Require user to fill out both checkboxes and the textarea

		if (quota.val().length == 0 || reason.val().length == 0) {
			this.$el.find('.alert').removeClass('alert-info').addClass('alert-error').html(function() {
				var content = '<i class="icon-warning-sign"></i> ';
				content += 'Please complete both fields before submitting the resource request form.';
				return content;
			});

			if (quota.val().length == 0)
				quota.closest('.control-group').addClass('error');
			else
				quota.closest('.control-group').removeClass('error');

			if (reason.val().length == 0)
				reason.closest('.control-group').addClass('error');
			else
				reason.closest('.control-group').removeClass('error');

			return false;

		}
		else {	
			var success = this.submit_resource_request();

			if (!success) {
				this.$el.find('.modal-footer a').eq(1).hide();
				return false;
			}
			else {
				this.button_listener();
			}
		}
	},
	submit_resource_request: function() {

		var form = this.$el.find('form[name="request_resources_form"]');

		var success;

		var self = this;
		$.ajax({
			type: 'POST',
			async: false,
			url: site_root + '/api/request_quota/', 
			data: form.serialize(),
			success: function() {
				Atmo.Utils.notify("Request Sent Successfully", "Support will be in touch with you shortly.");

				success = true;
			},
			error: function() {
				self.$el.find('.alert').removeClass('alert-info').addClass('alert-error').html(function() {
					var content = '<i class="icon-warning-sign"></i> ';
					content += '<strong>An error occurred</strong> Please email your resource request to <a href="mailto:support@iplantcollaborative.org">support@iplantcollaborative.org</a>.';
					return content;
				});

				success = false;
			},
			dataType: 'text'
		});

		return success;
	}
});