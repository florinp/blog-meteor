if (!RedactorPlugins) var RedactorPlugins = {};
Session.setDefault('images', []);
(function($) {

    RedactorPlugins.imagemeteor = function() {
        return {
            se: {},
            in: {},
            co: {},
            getTemplate: function() {
                return String()
                    + '<section id="redactor-modal-imageMeteor">'
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
                this.modal.load('imagemeteor', 'Upload image', 600);

                var $modal = this.modal.getModal();

                this.modal.createTabber($modal);
                this.modal.addTab(1, 'Upload image', 'active');
                this.modal.addTab(2, 'Choose image');

                var $tabBox1 = $('<div class="redactor-tab redactor-tab1">');
                $tabBox1.html(String()
                    + '<label>Image</label>'
                    + '<input type="file" name="file" id="image" />'
                );
                var $tabBox2 = $('<div class="redactor-tab redactor-tab2" style="overflow: auto; height: 300px;">').hide();

                var $self = this.imagemeteor;
                var images = Images.find();
                images.forEach(function(image){
                    var fsFile = new FS.File(image);
                    var img = $('<img src="'+ fsFile.url({store: 'systemImages'}) +'" data-id="'+ image._id +'" class="image" style="width: 100px; height: 75px; cursor: pointer; margin-top: 2px; margin-right: 5px;"  />');
                    $tabBox2.append(img);
                    $(img).on('click', function(){
                        var $this = $(this);
                        $self.insertImage($this.data('id'));
                    });
                });

                $modal.append($tabBox1);
                $modal.append($tabBox2);

                //this.modal.createCancelButton();

                var button = this.modal.createActionButton('Insert');
                button.on('click', this.imagemeteor.insertImageFile);

                this.se.save();
                this.modal.show();
            },
            insertImageFile: function() {

                this.se.restore();
                this.modal.close();

                var current = this.se.getBlock() || this.se.getCurrent();
                var insert = this.in;

                var file = $('#image').get(0).files[0];
                var images = Session.get('images');

                var progressInt = null;
                var progress = 0;

                if(file) {
                    var fileObj = Images.insert(file);
                    if(fileObj) {

                        progressInt = setInterval(function(){
                            progress = fileObj.uploadProgress();
                            console.log("Progress: " + progress);
                            if(progress >= 100) {
                                clearInterval(progressInt);
                                console.log("success & " + progress);
                                if(fileObj.isUploaded()) {
                                    setTimeout(function(){
                                        if (current) {
                                            $(current).after('<img src="' + fileObj.url({store: 'systemImages'}) + '" width="500px" />');
                                        }
                                        else {
                                            insert.html('<img src="' + fileObj.url({store: 'systemImages'}) + '" width="500px" />');
                                        }
                                    }, 500);
                                }
                            }
                        }, 300);
                    }
                }

                this.co.sync();
            },
            insertImage: function(imageId) {

                this.se.restore();
                this.modal.close();

                var current = this.se.getBlock() || this.se.getCurrent();
                var insert = this.in;

                var image = Images.findOne({_id: imageId});
                var fsFile = new FS.File(image);

                if (current) {
                    $(current).after('<img src="' + fsFile.url({store: 'systemImages'}) + '" width="500px" />');
                }
                else {
                    insert.html('<img src="' + fsFile.url({store: 'systemImages'}) + '" width="500px" />');
                }

                this.co.sync();
            }
        }
    }

})(jQuery);