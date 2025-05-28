import ts from "typescript";

export default function transformer(): ts.TransformerFactory<ts.SourceFile> {
  return (context) => {
    const visit: ts.Visitor = (node) => {
      if (ts.isJsxExpression(node) && node.expression) {
        // Skip simple identifiers and literals
        if (
          ts.isIdentifier(node.expression) ||
          ts.isLiteralExpression(node.expression)
        ) {
          return ts.visitEachChild(node, visit, context);
        }

        // Check if this is inside an event handler prop
        const parent = node.parent;
        if (ts.isJsxAttribute(parent) && parent.name) {
          const attributeName = parent.name.getText();
          // Don't wrap event handlers (they're already functions)
          if (
            attributeName.startsWith("on:") ||
            attributeName.startsWith("on")
          ) {
            return ts.visitEachChild(node, visit, context);
          }
        }

        // Wrap complex expressions in interceptor
        const arrowFunction = ts.factory.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          node.expression
        );

        return ts.factory.createJsxExpression(undefined, arrowFunction);
      }

      return ts.visitEachChild(node, visit, context);
    };

    return (node) => ts.visitNode(node, visit) as ts.SourceFile;
  };
}
