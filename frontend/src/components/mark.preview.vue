<style>

.markdown hr {
    height: .05em;
    border: 0;
    color: #ccc;
    background-color: #ccc
}

.markdown blockquote {
    margin: 1em 0;
    border-left: 4px solid #ddd;
    padding: 0 1em;
    color: #666
}

.markdown pre {
    font-size: 14px;
    padding: 16px;
    overflow: auto;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px
}

.markdown code {
    padding: .2em .4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27,31,35,.05);
    border-radius: 3px;
    font-family: SFMono-Regular,Consolas,"Liberation Mono",Menlo,Courier,monospace
}

.markdown pre>code {
    border: 0;
    margin: 0;
    padding: 0;
    background-color: #f6f8fa;
    font-size: 100%
}

.markdown a,.markdown a:visited {
    color: #4183c4;
    background-color: inherit;
    text-decoration: none
}

.markdown img {
    max-width: 100%
}


.markdown table {
    display: block;
    width: 100%;
    overflow: hidden;
    border-spacing: 0;
    border-collapse: collapse
}

.markdown table tr {
    background-color: #fff;
    border-top: 1px solid #c6cbd1
}

.markdown table tr:nth-child(2n) {
    background-color: #fafafa;
}

.markdown table th {
    padding: 6px 13px;
    border: 1px solid lightgray;
    /*background-color: #fafafa;*/
    font-weight: 900;
}
.markdown table td {
    padding: 6px 13px;
    border: 1px solid #dfe2e5
}


.markdown blockquote,.markdown dl,.markdown ol,.markdown p,.markdown pre,.markdown table,.markdown ul {
    margin-top: 0;
    margin-bottom: .72em
}

</style>
<template>
    <div>
        <slot></slot>
        <div class="markdown" v-html="html" ref="content"></div>
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
                    // highlight (code) {
                    //     return _this.highlight(code);
                    // },
                    renderer: renderer
                });
            }
        },
        mounted () {
            this.renderMd();
        }
    };
</script>