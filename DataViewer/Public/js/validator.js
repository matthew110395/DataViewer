// Get the form instance

$('#newChart').bootstrapValidator({

    // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
        cname: {
            validators: {
                regexp: {
                    regexp: /^[\w]+$/,
                    message: 'Spaces are not accepted'
                },
                notEmpty: {
                    message: 'Please enter a chart name'
                }
            }
        },
        ctit: {
            validators: {
                
                notEmpty: {
                    message: 'Please enter a chart name'
                }
            }
        },
        sql: {
            validators: {
                stringLength: {
                    min: 2,
                },
                notEmpty: {
                    message: 'Please enter SQL'
                }
            }
        }
    }
});
  


