/* eslint-disable @next/next/no-document-import-in-page */
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { Helmet } from 'react-helmet';

// Via https://github.com/vercel/next.js/blob/canary/examples/with-react-helmet/pages/_document.js

export default class MyDocument extends Document<any> {
  static async getInitialProps(ctx: DocumentContext) {
    const documentProps = await super.getInitialProps(ctx);
    // see https://github.com/nfl/react-helmet#server-usage for more information
    // 'head' was occupied by 'renderPage().head', we cannot use it

    return { ...documentProps, helmet: Helmet.renderStatic() };
  }

  // should render on <html>
  get helmetHtmlAttrComponents() {
    return this.props.helmet.htmlAttributes.toComponent();
  }

  // should render on <body>
  get helmetBodyAttrComponents() {
    return this.props.helmet.bodyAttributes.toComponent();
  }

  // should render on <head>
  get helmetHeadComponents() {
    return Object.keys(this.props.helmet)
      .filter((el) => el !== 'htmlAttributes' && el !== 'bodyAttributes')
      .map((el) => this.props.helmet[el].toComponent());
  }

  render() {
    return (
      <Html {...this.helmetHtmlAttrComponents}>
        <Head>{this.helmetHeadComponents}</Head>
        <body {...this.helmetBodyAttrComponents}>
          <Main />
          <NextScript />
          <div id="modal-root"></div>
        </body>
      </Html>
    );
  }
}
