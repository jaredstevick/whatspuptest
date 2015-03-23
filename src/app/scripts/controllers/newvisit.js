angular.module('whatsPup')
    .controller('NewVisitCtrl', function (Auth, $state, $stateParams, $firebaseObject, $http) {
        var self = this;
        this.loggedIn = Auth.loggedIn;

        var clientVisit = new Firebase('https://whatspup.firebaseio.com/Clients/' + $stateParams.user + '/' + $stateParams.clientId);


        this.visitObj = $firebaseObject(clientVisit);



        this.visitObj.$loaded().then(function (data) {
            return self.getEmail = data.email;
        });

        this.image = '';


        document.getElementById("upload_widget_opener").addEventListener("click", function() {
            
            console.log("opened");
            cloudinary.openUploadWidget(
                { 
                    cloud_name: 'jaredstevick',
                    upload_preset: 'xnpszqid'
                }, 
            function(error, result) { 
                console.log(result[0].url)
                self.image = result[0].url;
                return self.image 
            });

        }, false);
        


        var currentdate = new Date();
        var time = (currentdate.getMonth() + 1) + "/" + currentdate.getDate() + "/" + currentdate.getFullYear() + " at " + currentdate.getHours() + ":" + currentdate.getMinutes(); //get time
        
        this.sentEmail = function () {
            console.log(this.image);
            $http({
                method: "POST",
                url: "https://mandrillapp.com/api/1.0/messages/send-template.json",
                data: {
                    'key': 'SjfF7oGr1BHLUnBlnSF20A',
                    "template_name": "whatspup1",
                    "template_content": [
                        {
                            "name": "example name",
                            "content": "example content"
                        }
                    ],
                    'message': {
                        'from_email': 'whatspupupdate@gmail.com',
                        'from_name': 'WhatsPup',
                        'headers': {
                            'Reply-To': 'whatspupupdate@gmail.com'
                        },
                        
                        'subject': 'New Visit Update from WhatsPup',
                        
                        'to': [
                            {
                                'email': this.getEmail,
                                'name': 'name',
                                'type': 'to'
                        }],
                    
                    "global_merge_vars": [
                        {
                            "name": "time",
                           "content": time
                        },
                        {
                            "name": "food",
                            "content": this.food
                        },
                        {
                            "name": "water",
                            "content": this.water
                        },
                        {
                            "name": "play",
                            "content": this.play
                        },
                        {
                            "name": "treats",
                            "content": this.treats
                        },
                        {
                            "name": "meds",
                            "content": this.meds
                        },
                        {
                            "name": "mess",
                            "content": this.mess
                        },
                        {
                            "name": "packages",
                            "content": this.packages
                        },
                        {
                            "name": "mail",
                            "content": this.mail
                        },
                        {
                            "name": "plants",
                            "content": this.plants
                        },
                        {
                            "name": "other",
                            "content": this.other
                        },
                        {
                            "name": "message",
                            "content": this.message
                        },
                        {
                            "name": "image",
                            "content": this.image
                        }
                    ]
                    }
                }
            })
                .success(function (response) {
                    alert('The visit has been saved. Thank you!'); // show success message
                    console.log(response);
                })
                .error(function (response) {
                    alert('There was a problem sending the visit.');
                });
        }

    });
