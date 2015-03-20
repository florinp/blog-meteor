if (!RedactorPlugins) var RedactorPlugins = {};
Session.setDefault('images', []);
(function($) {

    RedactorPlugins.imagemeteor = function() {
        return {
            se: null,
            in: null,
            co: null,
            getTemplate: function() {
                return String()
                    + '<section id="redactor-modal-imageMeteor">'
                    + '<label>Image</label>'
                    + '<input type="file" name="image" id="image" />'
                    + '</section>';
            },
            init: function() {
                console.log('Init image meteor');

                var button = this.button.add('imagemeteor', 'Insert image');

                this.se = this.selection;
                this.in = this.insert;
                this.co = this.code;

                this.button.setAwesome('imagemeteor', 'fa-image');
                this.button.addCallback(button, this.imagemeteor.show);
            },
            show: function() {

                this.modal.addTemplate('imagemeteor', this.imagemeteor.getTemplate());
                this.modal.load('imagemeteor', 'Upload image', 400);

                //this.modal.createCancelButton();

                var button = this.modal.createActionButton('Insert');
                button.on('click', this.imagemeteor.insert);

                this.se.save();
                this.modal.show();
            },
            insert: function() {

                this.se.restore();
                this.modal.close();

                var current = this.se.getBlock() || this.se.getCurrent();
                var insert = this.in;

                var file = $('#image').get(0).files[0];
                var images = Session.get('images');

                if(file) {
                    var fileObj = Images.insert(file);
                    if(fileObj) {
                        var fsFile = new FS.File(fileObj);
                        setTimeout(function() {
                            if (current) $(current).after('<img src="'+ fsFile.url({store: 'systemImages'}) +'" />');
                            else
                            {
                                insert.html('<img src="'+ fsFile.url({store: 'systemImages'}) +'" />');
                            }
                        }, 1500);
                    }
                }

                this.co.sync();
            }
        }
    }

})(jQuery);