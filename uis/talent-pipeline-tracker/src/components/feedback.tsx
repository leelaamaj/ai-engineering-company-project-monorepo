export function RequestError({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="feedback error" role="alert">
      <p>{message}</p>
      {retry && <button className="button secondary" onClick={retry}>Try again</button>}
    </div>
  );
}
