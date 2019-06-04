<template>
   <div style="position:absolute;top:0px;">
       <input type="file" style="width:100%;opacity:0" @change="fileSelect">
   </div>
</template>
<script>
    export default {
        props: {
            uploadUrl: {
                type: String,
                default: 'select'
            },
            type: {
                type: String,
                default: 'select'
            },
            /**
             * 1: 编辑器的上传
             * 2: 发文章时的封面大图
             * 3: 编辑器的拖拽上传
             * 4: 上传用户封面
             * 5: 上传用户头像
             * 6: 上传 markdown 文件
             */
            styles: {
                type: Number,
                default: 0
            },
            cover: String,
            // 为 true 时，是设置头像、封面，获取token的链接不同
            info: {
                type: Boolean,
                default: false
            },
            // styles 为 5 时使用
            showBtn: Boolean,
            config: Object,
            beforeUpload: Function,
            paste: Boolean
        },
        data () {
            return {
                uploadForm: {},
                uploadPercent: 0,
                uploadStatus: 0,  // 0未上传，1上传中
                noUploadAccess: false
            };
        },
        computed: {
        },
        methods: {
            watchParseImage(textarea){
                textarea.addEventListener('paste', ( event )=>{
                    
                    var items = (event.clipboardData && event.clipboardData.items) || [];
                    var file = null;
                
                    if (items && items.length) {
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].type.indexOf('image') !== -1) {
                                var file=items[i].getAsFile();
                                this.uploadFile(file);
                                break;
                            }
                        }
                    
                    }
                });
            },
            fileSelect(e){
                
                var file=event.target.files[0];
                this.uploadFile(file);
            },
            uploadFile(file){
                var self=this;
                var url = this.uploadUrl;
                var xhr=new XMLHttpRequest();
                xhr.upload.onprogress = function (e) {
                    var percent=(e.loaded/e.total)*100
                    console.log(percent);
                    self.$emit("progress",{percent:percent});
                   
                }
                xhr.onreadystatechange = function (oEvent) {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var responseText = xhr.responseText;
                        self.$emit("complete",{response:responseText});
                        
                    }
                };

                xhr.open("POST", url, true);

                function getFormData(fileInfo) {
                    var formData = new FormData();
                    formData.append("file", fileInfo);
                    return formData;
                }
                var fd = getFormData(file);
                xhr.send(fd);
            }
          
        }
    };
</script>