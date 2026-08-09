import { Link } from "react-router-dom";

function NoteCard({ note }) {
  return (
    <Link to={`/notes/${note.id}`}>
      <div className="rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{note.title}</div>
          <p
            className="text-gray-700 text-base note-content"
            dangerouslySetInnerHTML={{ __html: note.content }}
          ></p>
        </div>
      </div>
    </Link>
  );
}

export default NoteCard;
