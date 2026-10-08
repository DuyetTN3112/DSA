import type { Stage } from '../types';

/** Stage kèm cross-ref sang Q-bank LeetCode (giữ nguyên từ bản vanilla) */
export interface StageWithQBank extends Stage {
  Q?: string[];
}

/** Lộ trình học: 14 giai đoạn (giữ nguyên từ bản vanilla) */
export const STAGES: StageWithQBank[] = [
  {
    "n": "Mẫu giáo: trước khi có máy tính",
    "d": "Đếm, so sánh, thứ tự, cái tên, làm theo từng bước, nếu thì, lặp lại, quy luật, rồi tập viết cho đúng thứ tự. Không cần biết gì trước",
    "L": [
      "k1",
      "k2",
      "k3",
      "rd1",
      "k4",
      "k5",
      "k6",
      "k7",
      "k8",
      "k9",
      "bx0"
    ],
    "Q": [
      "sm1",
      "fz"
    ]
  },
  {
    "n": "Khởi động: Python cơ bản",
    "d": "Biến, điều kiện, vòng lặp, hàm",
    "L": [
      "p1",
      "b1",
      "p2",
      "b2",
      "p3",
      "b3",
      "p4",
      "b4"
    ],
    "Q": [
      "sas",
      "cnd",
      "mms",
      "mp",
      "msa"
    ]
  },
  {
    "n": "Giai đoạn 1: Mảng",
    "d": "Từ đọc một hộp đến viết hàm Python theo quy trình thực tế",
    "L": [
      "l1",
      "a2",
      "a3",
      "b5",
      "sm",
      "l2",
      "l3",
      "cn",
      "b6",
      "w1",
      "w2",
      "w3"
    ],
    "Q": [
      "dup",
      "ts",
      "ana"
    ]
  },
  {
    "n": "Phòng đọc lỗi và debug",
    "d": "Lỗi không đáng sợ: nó là thông tin",
    "L": [
      "e1",
      "e2",
      "e3",
      "e4"
    ],
    "Q": [
      "pal"
    ]
  },
  {
    "n": "Giai đoạn 2: Bảng tra (dictionary)",
    "d": "Đổi bộ nhớ lấy tốc độ",
    "L": [
      "d1",
      "d2",
      "h1",
      "h2",
      "h3",
      "w4",
      "w5",
      "w6",
      "w7"
    ],
    "Q": [
      "par"
    ]
  },
  {
    "n": "Mini project 1: Xử lý giao dịch",
    "d": "Yêu cầu, hàng rào, test, giải đề như ở công ty",
    "L": [
      "m1",
      "m2",
      "m3",
      "w9"
    ],
    "Q": [
      "bsr"
    ]
  },
  {
    "n": "Giai đoạn 3: Hai con trỏ",
    "d": "Một vòng lặp thay cho hai",
    "L": [
      "tp"
    ]
  },
  {
    "n": "Giai đoạn 4: Stack và Queue (có mini project 3)",
    "d": "Ngoặc trong trình soạn thảo, giới hạn tốc độ của API",
    "L": [
      "stk",
      "que",
      "w11",
      "rl1",
      "w12"
    ]
  },
  {
    "n": "Giai đoạn 5: Tìm kiếm và sắp xếp",
    "d": "Chia đôi mỗi lần",
    "L": [
      "bs",
      "bub"
    ]
  },
  {
    "n": "Giai đoạn 6: Đệ quy",
    "d": "Bài nhỏ hơn giống hệt bài lớn",
    "L": [
      "r1",
      "r2",
      "r3",
      "w8"
    ]
  },
  {
    "n": "Giai đoạn 7: Linked list, cây",
    "d": "Dữ liệu nối bằng con trỏ",
    "L": [
      "n1",
      "n2",
      "n3",
      "t1",
      "t2"
    ]
  },
  {
    "n": "Giai đoạn 8: Đồ thị, quy hoạch động",
    "d": "Ghép tất cả lại",
    "L": [
      "g1",
      "g2",
      "g3",
      "dp1",
      "dp2"
    ]
  },
  {
    "n": "Ứng dụng thực tế: DSA dùng ở đâu?",
    "d": "Cache, hàng đợi, undo, phụ thuộc, thư mục, chọn cấu trúc",
    "L": [
      "ap1",
      "ap2",
      "ap3",
      "ap4",
      "ap5",
      "ap6"
    ]
  },
  {
    "n": "Mini project 2: Bộ xếp thứ tự cài đặt",
    "d": "Đồ thị phụ thuộc, phát hiện vòng, lỗi như hệ thống thật",
    "L": [
      "w10"
    ]
  }
];

/** Thứ tự 77 bài học — derive từ STAGES để không bao giờ lệch */
export const LESSON_ORDER: string[] = STAGES.flatMap((s) => s.L);
