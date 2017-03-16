// Get the form instance
var socket = io();
val = false;
//$("#sql").focusout(function () {
//    var value = $("#sql").val();
//    socket.emit('va', value);
//});
socket.on('sqlval', function (vali) {
    console.log(vali);
    val = vali;
});

//(function ($) {
//    $.fn.bootstrapValidator.validators.sqlval = {
//        /**
//         * @param {BootstrapValidator} validator The validator plugin instance
//         * @param {jQuery} $field The jQuery object represents the field element
//         * @param {Object} options The validator options
//         * @returns {boolean}
//         */
//        validate: function(validator, $field, options) {
//            // You can get the field value
            
            
//                if (val) {
//                    return true;
//                } else {
//                    return false;
//                }
            
//            //
//            // Perform validating
//            // ...
//            //
//            // return true if the field value is valid
//            // otherwise return false
//        }
//    };
//}(window.jQuery));

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
                //,
                //sqlval: {
                //    message:"NOT SQL"
                //}
            }
        }
    }
});
  


