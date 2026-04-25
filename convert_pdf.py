import fitz
import os

input_pdf = "src/创鸿信画册.pdf"
single_dir = "src/single_pages"
product_dir = "src/product_pdfs"

os.makedirs(single_dir, exist_ok=True)
os.makedirs(product_dir, exist_ok=True)

# Step 1: 拆左右页为单页
doc = fitz.open(input_pdf)
single_doc = fitz.open()

for i, page in enumerate(doc):
    rect = page.rect
    mid_x = rect.width / 2

    halves = [
        ("L", fitz.Rect(0, 0, mid_x, rect.height)),
        ("R", fitz.Rect(mid_x, 0, rect.width, rect.height)),
    ]

    for side, clip in halves:
        new_page = single_doc.new_page(width=clip.width, height=clip.height)
        new_page.show_pdf_page(new_page.rect, doc, i, clip=clip)

single_doc.save(os.path.join(single_dir, "all_single_pages.pdf"))
single_doc.close()
doc.close()

# Step 2: 按你的定义组合产品 PDF
# 注意：这里的页码是“拆完后的单页 PDF 页码”
ranges = {
    "O-Ring":   list(range(6, 30)),    # 原PDF第3页右半 ~ 第15页左半
    "X-Ring":   list(range(30, 32)),   # 原PDF第15页右半 ~ 第16页左半
    "UN":       list(range(32, 45)),   # 原PDF第16页右半 ~ 第22页右半
    "骨架油封": list(range(45, 54)),   # 原PDF第23页左半 ~ 第27页左半
    "V型圈":    list(range(54, 56)),   # 原PDF第27页右半 ~ 第28页左半
}

single_pdf = fitz.open(os.path.join(single_dir, "all_single_pages.pdf"))

for name, pages in ranges.items():
    out = fitz.open()
    for p in pages:
        out.insert_pdf(single_pdf, from_page=p - 1, to_page=p - 1)
    out.save(os.path.join(product_dir, f"{name}.pdf"))
    out.close()

single_pdf.close()