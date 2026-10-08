// Map lỗi Skulpt sang tiếng Việt, theo triết lý "gợi hướng kiểm tra,
// không đưa đáp án sửa sẵn".
import type { SkulptError } from './skulpt-types';

export interface MappedError {
  kind: string;
  line: number | null;
  message: string;
}

function frameLine(err: SkulptError): number | null {
  const frame = err.traceback?.[0];
  return typeof frame?.lineno === 'number' ? frame.lineno : null;
}

function messageOf(err: SkulptError): string {
  try {
    return err.tp$str().v;
  } catch {
    return '';
  }
}

function nameOf(err: SkulptError): string {
  return typeof err.tp$name === 'string' ? err.tp$name : 'Error';
}

/** Trích tên biến từ message dạng "name 'x' is not defined". */
function varName(msg: string): string | null {
  const m = /name '([^']+)' is not defined/.exec(msg);
  return m?.[1] ?? null;
}

export function mapSkulptError(err: SkulptError, code: string): MappedError {
  const kind = nameOf(err);
  const msg = messageOf(err);
  const line = frameLine(err);
  const at = line === null ? '' : `Dòng ${line}: `;

  switch (kind) {
    case 'SyntaxError': {
      // Skulpt báo "bad input" rất chung chung — heuristic thiếu dấu ":".
      const lines = code.split('\n');
      const bad = line === null ? '' : (lines[line - 1] ?? '').trimEnd();
      const missingColon =
        /^(for|while|if|elif|else|def|class|try|except|finally|with)\b/.test(bad) ||
        bad.endsWith(')');
      if (msg.includes('bad input') && missingColon) {
        return {
          kind,
          line,
          message:
            `${at}có vẻ thiếu dấu hai chấm \`:\` ở cuối. ` +
            `Sau \`for\`, \`if\`, \`while\`, \`def\`… phải có dấu \`:\`.`,
        };
      }
      return {
        kind,
        line,
        message: `${at}viết sai cú pháp rồi. Kiểm tra dấu ngoặc, dấu hai chấm và thụt dòng.`,
      };
    }
    case 'IndentationError':
      return {
        kind,
        line,
        message: `${at}thụt dòng chưa đúng. Các dòng trong cùng một khối phải thụt vào giống nhau (thường 4 dấu cách).`,
      };
    case 'NameError': {
      const v = varName(msg);
      return {
        kind,
        line,
        message: v
          ? `${at}biến \`${v}\` chưa được tạo. Kiểm tra xem có gõ sai tên biến không, hoặc biến được tạo ở dòng nào.`
          : `${at}tên này chưa được định nghĩa. Kiểm tra chính tả tên biến/hàm.`,
      };
    }
    case 'IndexError':
      return {
        kind,
        line,
        message: `${at}chỉ số vượt quá độ dài list. List có n phần tử thì chỉ số hợp lệ là 0 đến n-1.`,
      };
    case 'KeyError':
      return {
        kind,
        line,
        message: `${at}dict không có key \`${msg}\`. Kiểm tra lại tên key (phân biệt chữ hoa/thường).`,
      };
    case 'TypeError':
      if (msg.includes('cannot concatenate')) {
        return {
          kind,
          line,
          message: `${at}không cộng chuỗi với số được. Dùng \`str(x)\` để đổi số thành chuỗi, hoặc \`int(x)\` để đổi chuỗi thành số.`,
        };
      }
      return { kind, line, message: `${at}sai kiểu dữ liệu khi tính toán. Đọc kỹ xem đang cộng/so sánh kiểu gì với kiểu gì.` };
    case 'ZeroDivisionError':
      return { kind, line, message: `${at}không chia cho 0 được. Kiểm tra mẫu số trước khi chia.` };
    case 'ValueError':
      return { kind, line, message: `${at}giá trị chưa hợp lệ. Kiểm tra lại đầu vào của hàm ở dòng này.` };
    case 'AttributeError':
      return { kind, line, message: `${at}đối tượng không có thuộc tính/phương thức đó. Kiểm tra lại tên hàm.` };
    case 'ImportError':
      return {
        kind,
        line,
        message: `Không import được module đó. Chỉ dùng được các module cơ bản (math, random…).`,
      };
    case 'TimeLimitError':
      return {
        kind,
        line,
        message: `Chương trình chạy quá lâu — có thể vòng lặp không bao giờ dừng. Kiểm tra điều kiện dừng của \`while\`.`,
      };
    default:
      return { kind, line, message: `${at}lỗi ${kind}: ${msg}` };
  }
}
