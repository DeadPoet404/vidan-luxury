import {
  ImageResponse,
} from "next/og";

export const alt =
  "Vidan Luxury Apartments in Accra, Ghana";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#0b0b0a",
          color: "#f5f2eb",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 32,
            display: "flex",
            border:
              "1px solid rgba(200, 169, 107, 0.45)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: -65,
            top: -95,
            display: "flex",
            fontSize: 520,
            fontWeight: 700,
            letterSpacing: "-0.1em",
            color:
              "rgba(255,255,255,0.025)",
          }}
        >
          V
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent:
              "space-between",
            padding: "78px 86px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 27,
                fontWeight: 700,
                letterSpacing: "0.22em",
              }}
            >
              VIDAN
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 10,
                color: "#c8a96b",
                fontSize: 13,
                letterSpacing: "0.28em",
                textTransform:
                  "uppercase",
              }}
            >
              Luxury Apartments · Accra
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                maxWidth: 900,
                fontSize: 72,
                fontWeight: 300,
                lineHeight: 1.02,
                letterSpacing:
                  "-0.045em",
              }}
            >
              Stay somewhere worth arriving
              for.
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 30,
                color:
                  "rgba(245,242,235,0.58)",
                fontSize: 20,
                letterSpacing: "0.04em",
              }}
            >
              East Legon · Cantonments ·
              Spintex · Adenta
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
