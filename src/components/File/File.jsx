export default function File({ file }) {
  return (
    <a
      href={file.url}
      target="_blank"
      className="btn btn-outline-dark text-truncate w-100"
    >
      <i className="mr-2 fas fa-file"></i>
      {file.name}
    </a>
  )
}