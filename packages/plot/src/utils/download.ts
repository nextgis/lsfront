export function download(filename: string, content: string) {
  const pom = document.createElement('a');
  pom.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
  );
  pom.setAttribute('download', filename);
  pom.click();
}
