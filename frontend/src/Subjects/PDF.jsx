import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PDF.css';

function PDF() {
  const { subjectName, chapterNumber, topicNumber } = useParams();
  const [highlights, setHighlights] = useState([]); 
  const [showNoteContainer, setShowNoteContainer] = useState(false); 
  const [noteText, setNoteText] = useState(''); 
  const [notePosition, setNotePosition] = useState({ x: 0, y: 0 }); 
  const selectionRange = useRef(null); 
  const selectionText = useRef(''); 
  const selectionParagraph = useRef(null); 
  const noteContainerRef = useRef(null); 

  
  const handleTextSelection = (e) => {
    
    if (noteContainerRef.current && noteContainerRef.current.contains(e.target)) {
      return; 
    }

    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().trim() !== '') {
      const range = selection.getRangeAt(0);
      const paragraph = e.target.closest('.paragraph');
      if (paragraph) {
        const rect = range.getBoundingClientRect();
        setNotePosition({ x: rect.right, y: rect.top + window.scrollY });
        selectionRange.current = range;
        selectionText.current = selection.toString();
        selectionParagraph.current = paragraph;
        setShowNoteContainer(true);
      }
    }
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showNoteContainer &&
        noteContainerRef.current &&
        !noteContainerRef.current.contains(e.target) &&
        !e.target.closest('.paragraph')
      ) {
        setShowNoteContainer(false);
        setNoteText('');
        window.getSelection().removeAllRanges();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNoteContainer]);

  
  const handleAddNote = () => {
    if (noteText.trim() && selectionText.current && selectionRange.current) {
      const newHighlight = {
        id: Date.now(), 
        text: selectionText.current,
        note: noteText,
        paragraphId: selectionParagraph.current.dataset.id, 
        startOffset: selectionRange.current.startOffset,
        endOffset: selectionRange.current.endOffset,
      };
      setHighlights([...highlights, newHighlight]);
      setNoteText('');
      setShowNoteContainer(false);
      window.getSelection().removeAllRanges(); 
    }
  };

  
  const handleCancelNote = () => {
    setNoteText('');
    setShowNoteContainer(false);
    window.getSelection().removeAllRanges(); 
  };

  
  const renderParagraph = (text, paragraphId) => {
    const paragraphHighlights = highlights.filter((h) => h.paragraphId === paragraphId);
    if (!paragraphHighlights.length) return text;

    let result = [];
    let lastIndex = 0;

    paragraphHighlights.sort((a, b) => a.startOffset - b.startOffset).forEach((highlight) => {
      
      if (highlight.startOffset > lastIndex) {
        result.push(text.slice(lastIndex, highlight.startOffset));
      }
      
      result.push(
        <span
          key={highlight.id}
          className="highlighted-text"
          data-note={highlight.note}
        >
          {highlight.text}
        </span>
      );
      lastIndex = highlight.endOffset;
    });

    
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result;
  };

  
  const pages = [
    {
      title: '1. Overview',
      content: [
        `This topic introduces the fundamental concepts of ${subjectName}. Understanding these basics is crucial for mastering subsequent chapters. We will explore the core principles, historical context, and practical applications of this subject.`,
        `The study of ${subjectName} has evolved over centuries, with contributions from numerous scholars and practitioners. This section provides a brief history and sets the stage for deeper exploration.`,
      ],
    },
    {
      title: '2. Key Concepts',
      content: [
        `In this section, we delve into the key concepts that form the backbone of ${subjectName}. These include foundational theories, models, and methodologies that are widely used in the field.`,
      ],
      list: [
        'Concept 1: A brief explanation of the first core idea.',
        'Concept 2: Understanding the second principle and its applications.',
        'Concept 3: How this concept integrates with real-world scenarios.',
      ],
    },
    {
      title: '3. Practical Applications',
      content: [
        `The practical applications of ${subjectName} are vast and varied. This section highlights how the concepts learned can be applied in real-world scenarios, from industry use cases to research advancements.`,
        `By the end of this topic, you should be able to apply these principles to solve basic problems and understand their relevance in modern contexts.`,
      ],
    },
  ];

  return (
    <div className="pdf-page" onMouseUp={handleTextSelection}>
      <Link to={`/subjects/${subjectName}`} className="back-link">
        ← Back to Chapters
      </Link>
      <h1 className="page-title">
        Topic {topicNumber}: Introduction to {subjectName}
      </h1>
      <div className="textbook-container">
        <div className="pages-container">
          {pages.map((page, index) => (
            <div key={index} className="page-item">
              <div className="page">
                <h2 className="section-title">{page.title}</h2>
                {page.content.map((text, i) => (
                  <p
                    key={`${index}-${i}`}
                    className={`paragraph ${i === 0 ? 'mb-4' : ''}`}
                    data-id={`${index}-${i}`}
                  >
                    {renderParagraph(text, `${index}-${i}`)}
                  </p>
                ))}
                {page.list && (
                  <ul className="list">
                    {page.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showNoteContainer && (
        <div
          className="note-container"
          style={{ top: `${notePosition.y}px`, left: `${notePosition.x}px` }}
          ref={noteContainerRef}
        >
          <span className="message-icon">💬</span>
          <div className="note-input-container">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your note..."
              className="note-textarea"
            />
            <div className="note-buttons">
              <button onClick={handleCancelNote} className="note-button cancel">
                Cancel
              </button>
              <button onClick={handleAddNote} className="note-button add">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PDF;