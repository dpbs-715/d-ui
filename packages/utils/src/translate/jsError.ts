export function translateJsError(err: Error) {
  const msg = err.message;

  // 一元运算符缺少操作数
  let unaryMatch = msg.match(/missing unaryOp argument at character (\d+)/);
  if (unaryMatch) {
    const pos = unaryMatch[1];
    return `语法错误：一元运算符缺少操作数（位置：第 ${pos} 个字符）`;
  }

  //缺少表达式
  let exprMatch = msg.match(/Expected expression after (.+) at character (\d+)/);
  if (exprMatch) {
    const symbol = exprMatch[1];
    const pos = exprMatch[2];
    return `语法错误：在符号 '${symbol}' 后面缺少表达式（位置：第 ${pos} 个字符）`;
  }

  //变量名不能以数字开头
  let varNameMatch = msg.match(
    /Variable names cannot start with a number \((.+?)\) at character (\d+)/,
  );
  if (varNameMatch) {
    const varName = varNameMatch[1]; // 13v
    const pos = varNameMatch[2]; // 2
    return `语法错误：变量名不能以数字开头（非法变量名：${varName}，位置：第 ${pos} 个字符）`;
  }

  let unexpectedMatch = msg.match(/Unexpected "([^+\-*/%()]+?)" at character (\d+)/);
  if (unexpectedMatch) {
    const symbol = unexpectedMatch[1];
    const pos = unexpectedMatch[2];
    return `语法错误：在第 ${pos} 个字符处遇到意外的 '${symbol}' 符号`;
  }

  // 意外字符 / token
  if (msg.includes('Unexpected token')) {
    return '语法错误：遇到意外的字符或符号';
  }

  if (msg.includes('Unexpected end of input')) {
    return '语法错误：输入意外结束，可能缺少括号或花括号';
  }

  if (msg.includes('Unexpected string')) {
    return '语法错误：字符串不完整或不符合语法';
  }

  if (msg.includes('Unexpected number')) {
    return '语法错误：数字格式不正确或不符合语法';
  }

  if (msg.includes('Invalid or unexpected token')) {
    return '语法错误：无效或意外的字符';
  }

  // 引用错误
  if (msg.includes('is not defined')) {
    return '引用错误：变量未定义';
  }

  if (msg.includes('cannot access') && msg.includes('before initialization')) {
    return '引用错误：在变量初始化之前访问了该变量';
  }

  // 类型错误
  if (msg.includes('undefined is not a function')) {
    return '类型错误：调用了未定义的函数';
  }

  if (msg.match(/Cannot read property '.*' of undefined/)) {
    return '类型错误：尝试读取 undefined 的属性';
  }

  if (msg.match(/Cannot set property '.*' of undefined/)) {
    return '类型错误：尝试给 undefined 设置属性';
  }

  // 默认返回原文
  return msg;
}
