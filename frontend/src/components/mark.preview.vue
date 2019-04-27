<template>
    <div class="i-editor-md">
        <slot></slot>
        <div class="dev-md-content" v-html="html" ref="content"></div>
    </div>
</template>
<script>
    import marked from 'marked';

    export default {
        props: {
            content: String,
            highlight: Function
        },
        data () {
            return {
                html: ''
            }
        },
        watch: {
            content () {
                
                this.renderMd();
            }
        },
        methods: {
            renderMd () {
                //debugger;
 

                  const renderer = new marked.Renderer();

                const _this = this;
                this.html = marked(this.content, {
                    breaks: true,
                    headerIds: false,
                    highlight (code) {
                        return _this.highlight(code);
                    },
                    renderer: renderer
                });
            }
        },
        mounted () {
            this.renderMd();
        }
    };
</script>