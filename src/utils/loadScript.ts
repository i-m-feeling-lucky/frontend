export default (src: string) => new Promise((resolve) => {
  const script = document.createElement('script');
  script.onload = () => {
    resolve();
  };
  script.src = src;
  document.head.appendChild(script);
});
