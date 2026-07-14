// @ts-nocheck
import { describe, expect, test } from "bun:test";
import { getVisiblePages } from "./pagination";

describe("getVisiblePages", () => {
  test("shows all pages when total <= 7", () => {
    expect(getVisiblePages(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getVisiblePages(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test("shows start window correctly", () => {
    expect(getVisiblePages(1, 10)).toEqual([1, 2, 3, 4, 5, "...", 10]);
    expect(getVisiblePages(4, 10)).toEqual([1, 2, 3, 4, 5, "...", 10]);
  });

  test("shows end window correctly", () => {
    expect(getVisiblePages(7, 10)).toEqual([1, "...", 6, 7, 8, 9, 10]);
    expect(getVisiblePages(10, 10)).toEqual([1, "...", 6, 7, 8, 9, 10]);
  });

  test("shows middle window correctly", () => {
    expect(getVisiblePages(5, 10)).toEqual([1, "...", 4, 5, 6, "...", 10]);
    expect(getVisiblePages(6, 10)).toEqual([1, "...", 5, 6, 7, "...", 10]);
  });
});
