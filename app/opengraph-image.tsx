import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Block Market: the CMU marketplace for spare meal blocks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const bricolageBold = readFile(join(process.cwd(), "assets/BricolageGrotesque-Bold.ttf"));

const SQUARES = ["#1d8348", "#2359c4", "#c8322b", "#1b1a17"];

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#f6f1e7",
          color: "#1b1a17",
          fontFamily: "Bricolage Grotesque",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", width: 76, gap: 6 }}>
            {SQUARES.map((c) => (
              <div key={c} style={{ width: 35, height: 35, borderRadius: 9, background: c }} />
            ))}
          </div>
          <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -1.5 }}>Block Market</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, maxWidth: 950 }}>
            The CMU marketplace for spare meal blocks.
          </div>
          <div style={{ fontSize: 30, color: "#6b665c" }}>
            Eat for less than menu price, or get paid for blocks you won&rsquo;t use.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bricolage Grotesque", data: await bricolageBold, weight: 700, style: "normal" }],
    },
  );
}
