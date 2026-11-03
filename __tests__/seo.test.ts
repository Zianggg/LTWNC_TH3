import { absoluteUrl, breadcrumbJsonLd, serializeJsonLd, SITE_URL } from "@/lib/seo";

describe("breadcrumbJsonLd", () => {
  const data = breadcrumbJsonLd([
    { name: "Trang chủ", path: "/" },
    { name: "Lập trình Web nâng cao", path: "/subjects/lap-trinh-web-nang-cao" },
    { name: "BTTH 3", path: "/deadlines/1" },
  ]);

  test("đúng kiểu schema.org BreadcrumbList", () => {
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("BreadcrumbList");
  });

  test("position tăng dần từ 1 và item là URL tuyệt đối", () => {
    expect(data.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(data.itemListElement[2]).toEqual({
      "@type": "ListItem",
      position: 3,
      name: "BTTH 3",
      item: `${SITE_URL}/deadlines/1`,
    });
  });
});

describe("absoluteUrl", () => {
  test("không bị lặp dấu /", () => {
    expect(absoluteUrl("/deadlines")).toBe(`${SITE_URL}/deadlines`);
    expect(absoluteUrl("/")).toBe(`${SITE_URL}/`);
  });
});

describe("serializeJsonLd", () => {
  test("escape '<' để chuỗi </script> trong dữ liệu không đóng thẻ script", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });
});
