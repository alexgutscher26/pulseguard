import * as React from "react";

export interface BaseProps {
  children?: React.ReactNode;
  style?: React.CSSProperties | undefined;
  className?: string | undefined;
}

export function Html({
  children,
  lang = "en",
  dir = "ltr",
}: BaseProps & { lang?: string; dir?: string }) {
  return (
    <html lang={lang} dir={dir}>
      {children}
    </html>
  );
}

export function Head({ children }: BaseProps) {
  return (
    <head>
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {children}
    </head>
  );
}

export function Body({ children, style }: BaseProps) {
  return (
    <body
      style={{
        margin: 0,
        padding: 0,
        WebkitFontSmoothing: "antialiased",
        ...style,
      }}
    >
      {children}
    </body>
  );
}

export function Container({ children, style }: BaseProps) {
  return (
    <table
      align="center"
      width="100%"
      border={0}
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={{
        maxWidth: "600px",
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        ...style,
      }}
    >
      <tbody>
        <tr>
          <td>{children}</td>
        </tr>
      </tbody>
    </table>
  );
}

export function Section({ children, style }: BaseProps) {
  return (
    <table
      width="100%"
      border={0}
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={{
        width: "100%",
        ...style,
      }}
    >
      <tbody>
        <tr>
          <td>{children}</td>
        </tr>
      </tbody>
    </table>
  );
}

export function Text({ children, style }: BaseProps) {
  return (
    <p
      style={{
        margin: "0 0 16px",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export function Link({
  children,
  href,
  style,
  target = "_blank",
}: BaseProps & { href?: string | undefined; target?: string | undefined }) {
  return (
    <a
      href={href}
      target={target}
      rel="noreferrer"
      style={{
        textDecoration: "none",
        ...style,
      }}
    >
      {children}
    </a>
  );
}

export function Hr({ style }: Omit<BaseProps, "children">) {
  return (
    <hr
      style={{
        width: "100%",
        border: "none",
        borderTop: "1px solid #333333",
        margin: "16px 0",
        ...style,
      }}
    />
  );
}

// ─── Standalone Lightweight HTML Renderer (No react-dom/server dependency) ───

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const UNITLESS_PROPERTIES = new Set([
  "animationIterationCount",
  "borderImageOutset",
  "borderImageSlice",
  "borderImageWidth",
  "boxFlex",
  "boxFlexGroup",
  "boxOrdinalGroup",
  "columnCount",
  "columns",
  "flex",
  "flexGrow",
  "flexPositive",
  "flexShrink",
  "flexNegative",
  "flexOrder",
  "fontWeight",
  "lineClamp",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "tabSize",
  "widows",
  "zIndex",
  "zoom",
  "fillOpacity",
  "floodOpacity",
  "stopOpacity",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
]);

function styleObjectToString(style?: React.CSSProperties): string {
  if (!style || typeof style !== "object") return "";
  const entries: string[] = [];
  for (const [key, value] of Object.entries(style)) {
    if (value === null || value === undefined || value === "") continue;
    const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    const cssVal =
      typeof value === "number" && !UNITLESS_PROPERTIES.has(key) ? `${value}px` : value;
    entries.push(`${cssKey}:${cssVal}`);
  }
  return entries.join(";");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderNode(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(renderNode).join("");
  }

  if (React.isValidElement(node)) {
    const { type, props } = node as { type: any; props: any };

    if (typeof type === "function") {
      const rendered = type(props);
      return renderNode(rendered);
    }

    if (typeof type === "string") {
      const tag = type.toLowerCase();
      const attributes: string[] = [];
      let innerHtml: string | null = null;

      if (props) {
        for (const [propName, propValue] of Object.entries(props)) {
          if (propName === "children" || propName === "key" || propName === "ref") continue;

          if (propName === "style" && propValue && typeof propValue === "object") {
            const styleStr = styleObjectToString(propValue as React.CSSProperties);
            if (styleStr) {
              attributes.push(`style="${escapeHtml(styleStr)}"`);
            }
            continue;
          }

          if (propName === "className" && propValue) {
            attributes.push(`class="${escapeHtml(String(propValue))}"`);
            continue;
          }

          if (
            propName === "dangerouslySetInnerHTML" &&
            propValue &&
            typeof propValue === "object" &&
            "__html" in (propValue as any)
          ) {
            innerHtml = String((propValue as any).__html);
            continue;
          }

          if (propName === "httpEquiv") {
            attributes.push(`http-equiv="${escapeHtml(String(propValue))}"`);
            continue;
          }

          if (typeof propValue === "boolean") {
            if (propValue) {
              attributes.push(propName.toLowerCase());
            }
            continue;
          }

          if (propValue !== null && propValue !== undefined) {
            attributes.push(`${propName.toLowerCase()}="${escapeHtml(String(propValue))}"`);
          }
        }
      }

      const attrStr = attributes.length > 0 ? ` ${attributes.join(" ")}` : "";

      if (VOID_ELEMENTS.has(tag)) {
        return `<${tag}${attrStr} />`;
      }

      if (innerHtml !== null) {
        return `<${tag}${attrStr}>${innerHtml}</${tag}>`;
      }

      const childrenStr = props && "children" in props ? renderNode(props.children) : "";
      return `<${tag}${attrStr}>${childrenStr}</${tag}>`;
    }

    if (type === React.Fragment) {
      return props && "children" in props ? renderNode(props.children) : "";
    }
  }

  return "";
}

export async function render(component: React.ReactElement): Promise<string> {
  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n';
  return doctype + renderNode(component);
}
