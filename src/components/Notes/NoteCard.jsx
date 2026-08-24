import { Link } from "react-router-dom";

function NoteCard({ note }) {
  return (
    <Link to={`/notes/${note._id}`}>
      <div className="rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{note.title}</div>
          <p
            className="text-gray-700 text-base note-content"
            dangerouslySetInnerHTML={{ __html: note.content }}
          ></p>
        </div>
        <div className="px-6 pt-4 pb-2">
          {Array.isArray(note.tags) &&
            note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>
    </Link>
  );
}

export default NoteCard;
