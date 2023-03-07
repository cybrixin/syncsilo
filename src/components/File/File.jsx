export default function File({ file }) {
  console.log(file);
  return (
    <a
      href={file.url}
      target="_blank"
      className="btn btn-outline-dark text-truncate w-100"
    >
      <i className={`mr-2 fas ${file?.icon ?? "fa-file"}`}></i>&nbsp;{file.name}
    </a>
  )
}