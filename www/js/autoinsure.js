var appID = 'WRFcHPVIEx8yhjIJseRNjWK5eyTovP9C6c0R4Mrc';
        var jsKey = 'BrFDCEivhbdWcALdC1DROaKw8fCIFDL7Qvsxdgq9';
        
        $(function() {
            Parse.initialize(appID, jsKey);
        
        });
        
        //
        //  Login Btn
        //
        $('#loginBtn').on('click', function(){
            $.mobile.loading( "show", { text: 'Login ...', textVisible: true } );
            
            var uname = $('#l_uname').val();
            var pword = $('#l_pword').val();
            
            Parse.User.logIn(uname, pword, {
                success: function(user) {
                    $.mobile.loading( "hide" );
                    $('#l_resp').text('Login successful, redirecting');
                    $.mobile.navigate('#landing');
                },
                error: function(user, error) {
                    $.mobile.loading( "hide" );
                    $('#l_resp').text(error.message);
                }
            });
        });
        
        //
        //  Password Reset
        //
        $('#resetBtn').on('click', function(){
            $.mobile.loading( "show", { text: 'Reset ...', textVisible: true } );
            var email = $('#r_email').val();
            
            Parse.User.requestPasswordReset(email, {
                success: function(){
                    $.mobile.navigate('#landing');
                    $('#r_resp').text('Your password has been reset. Please check your mail.');
                },
                error: function(error){
                    $.mobile.navigate('#landing');
                    $('#r_resp').text(error.message);
                }
            });
        });
        
        //
        //  Register
        //
        $('#regBtn').on('click', function(){
            $.mobile.loading( "show", { text: 'Reset ...', textVisible: true } );
            
            var uname = $('#reg_uname').val();
            var pword = $('#reg_pword').val();
            var pword_2 = $('#reg_pword_2').val();
            var phone = $('#reg_phone').val();
            var email = $('#reg_email').val();
            var fullname = $('#reg_fullname').val();
            var address = $('#reg_address').val();
            
            if(uname == '') {
                $.mobile.loading( "hide" );
                $('#reg_resp').text('Username must be supplied');
                return;
            }
          
          if(pword == '') {
            $.mobile.loading( "hide" );
            $('#reg_resp').text('Password must be supplied');
            return;
          }
          
          if(email == '') {
            $.mobile.loading( "hide" );
            $('#reg_resp').text('Email must be supplied');
            return;
          }
          
          if(pword === pword_2){
            Parse.initialize(appID, jsKey);
            
            var user = new Parse.User();
            user.set('username', uname);
            user.set('password', pword);
            user.set('email', email);
            user.set('phone', phone);
            user.set('fullname', fullname);
            user.set('address', address);
            
            user.signUp(null, {
              success: function(user) {
                $.mobile.loading( "hide" );
                $('#reg_resp').text('Your account has been successfully created. Please wait, redirecting ...');
                $.mobile.navigate('#landing');
              },
              error: function(user, error) {
                $.mobile.loading( "hide" );
                $('#reg_resp').text(error.message);
              }
            });
          } else {
            $.mobile.loading( "hide" );
            $('#reg_resp').text('Password must match confirmation password');
            return;
          }
        });
        
        //
        //  Landing Page
        //
        $('#landing').on('pageshow', function(e){
            var currentUser = Parse.User.current();
          
          if(currentUser) {
            var Vehicle = Parse.Object.extend('Vehicle');
            var query = new Parse.Query(Vehicle);
            query.equalTo('owner', currentUser);
            
            query.find({
              success: function(results) {
                $('#vehiclesList').empty();
                $('#vehiclesList').append('<li data-role="list-divider" role="heading">Vehicles</li>');
                for(var i=0; i<results.length; i++) {
                  var car = results[i];
                  $('#vehiclesList').append('<li data-theme="c">' + car.get('make') + ' ' + car.get('type') + ' ' + car.get('reg') + '</li>');
                }
                $('#vehiclesList').listview('refresh');
              },
              error: function(error) {
                console.log(error.message);
              }
            });
          }
        });