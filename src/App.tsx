import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Menu, X, FileText, FolderOpen, BookOpen } from 'lucide-react';

// Read all markdown files in /docs and /
const docsContext = import.meta.glob('/docs/**/*.md', { query: '?raw', import: 'default' });
const rootContext = import.meta.glob('/*.md', { query: '?raw', import: 'default' });

const allFiles = { ...rootContext, ...docsContext };

// File tree data structure
interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: Record<string, FileNode>;
}

function buildFileTree(files: string[]): FileNode {
  const root: FileNode = { name: 'root', path: '', type: 'directory', children: {} };

  for (const file of files) {
    const parts = file.split('/').filter(Boolean);
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      const path = '/' + parts.slice(0, i + 1).join('/');

      if (!current.children) current.children = {};

      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          path: isFile ? file : path,
          type: isFile ? 'file' : 'directory',
          ...(isFile ? {} : { children: {} }),
        };
      }
      current = current.children[part];
    }
  }
  return root;
}

const FileTreeItem = ({ node, level, activeFile, onSelect }: { node: FileNode, level: number, activeFile: string, onSelect: (path: string) => void }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.type === 'directory') {
    return (
      <div className="select-none">
        <div 
          className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-100 rounded-md cursor-pointer text-gray-700 hover:text-gray-900 transition-colors"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FolderOpen size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          <span className="font-medium text-sm">{node.name}</span>
        </div>
        {isOpen && node.children && (
          <div>
            {Object.values(node.children).map(child => (
              <FileTreeItem key={child.path} node={child} level={level + 1} activeFile={activeFile} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = activeFile === node.path;
  
  return (
    <div 
      className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer transition-colors text-sm rounded-md ${
        isActive 
          ? 'bg-blue-50 text-blue-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
      style={{ paddingLeft: `${level * 12 + 12}px` }}
      onClick={() => onSelect(node.path)}
    >
      <FileText size={16} className={isActive ? 'text-blue-500' : 'text-gray-400'} />
      <span className="truncate">{node.name.replace('.md', '')}</span>
    </div>
  );
};

export default function App() {
  const [activeFile, setActiveFile] = useState<string>('/README.md');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Default to README if there is no file open, and make sure it exists or just use a default
  const availablePaths = Object.keys(allFiles);
  const fileTree = buildFileTree(availablePaths);

  useEffect(() => {
    // Basic routing based on hash
    const handleHashChange = () => {
      const hashData = window.location.hash.replace('#', '');
      if (hashData && allFiles[hashData]) {
        setActiveFile(hashData);
      } else if (hashData === '' && allFiles['/README.md']) {
        setActiveFile('/README.md');
      } else if (availablePaths.length > 0) {
        // Fallback to first available file if README is not there
        setActiveFile(allFiles['/README.md'] ? '/README.md' : availablePaths[0]);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [availablePaths.length]);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      if (allFiles[activeFile]) {
        try {
          const contentModule = await allFiles[activeFile]() as string;
          setMarkdownContent(contentModule);
        } catch (error) {
          console.error("Failed to load file content:", error);
          setMarkdownContent('# Error\nFailed to load content.');
        }
      } else {
        setMarkdownContent('# Not Found\nFile does not exist.');
      }
      setIsLoading(false);
    };

    loadContent();
  }, [activeFile]);

  const handleSelectFile = (path: string) => {
    window.location.hash = path;
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-20 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200 justify-between shrink-0">
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>QianPulsa Docs</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Files</div>
          {Object.values(fileTree.children || {}).map(node => (
            <FileTreeItem 
              key={node.path} 
              node={node} 
              level={0} 
              activeFile={activeFile} 
              onSelect={handleSelectFile} 
            />
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 flex items-center px-4 md:px-8 border-b border-gray-200 bg-white shrink-0 sticky top-0 z-10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md md:hidden mr-2"
          >
            <Menu size={20} />
          </button>
          
          <nav className="flex text-sm text-gray-500 truncate items-center">
            {activeFile.split('/').filter(Boolean).map((part, i, arr) => (
              <React.Fragment key={i}>
                <span className={i === arr.length - 1 ? 'text-gray-900 font-medium' : ''}>
                  {part}
                </span>
                {i < arr.length - 1 && <span className="mx-2 text-gray-300">/</span>}
              </React.Fragment>
            ))}
          </nav>
        </header>
        
        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 pb-24">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-100 rounded w-1/3 mb-8"></div>
                <div className="h-4 bg-gray-50 rounded w-full"></div>
                <div className="h-4 bg-gray-50 rounded w-5/6"></div>
                <div className="h-4 bg-gray-50 rounded w-4/6"></div>
              </div>
            ) : (
              <div className="markdown-body">
                <Markdown>{markdownContent}</Markdown>
              </div>
            )}
            
            {!isLoading && (
              <div className="mt-16 pt-8 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
                <span>View mode explicitly configured for development.</span>
                <a href="#/README.md" className="hover:text-gray-800 transition-colors">Back to Overview</a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
