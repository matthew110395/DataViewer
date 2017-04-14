//DataViewer Dashboard Application - Validataion
//Author: Matthew Smith - 12004210

//Created as part of BSc (Hons) Computing dissertation module at University of the Highlands and Islands - 2017

//Created: April 2017
//Last Modified: April 2017

//initialize socket.io
var socket = io();
val = false;

//*********
//Attempted to validate SQL against the database but too slow
//socket.on('sqlval', function (vali) {
//    console.log(vali);
//    val = vali;
//});

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

//**********

//Validaton for new chart box
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
                    min: 12,
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
  


