export function textWithLineBreaks(text: string) {
  // متن را بر اساس \n یا \r\n تقسیم می‌کنیم
  return text.split(/\r?\n/).map((line, index) => (
    <>
      {line}
      <br />
    </>
  ));
}
