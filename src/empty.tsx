import type { JSX } from "react";

export type EmptyRenderer = (date: Date) => JSX.Element;

// Optionally export a custom renderer here.
// Example:
// export const customEmpty: EmptyRenderer = (date) => (
//   <div style={{padding: 16, color: '#9CA3AF'}}>비어있음 ({date.toDateString()})</div>
// );

export const customEmpty: EmptyRenderer | undefined = undefined;
