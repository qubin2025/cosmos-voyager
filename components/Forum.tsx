
import React, { useState } from 'react';
import { ForumPost, User } from '../types';
import { getForumBotResponse, getPostMetadata } from '../services/geminiService';

interface ForumProps {
  user: User;
  onOpenLogin: () => void;
  isAdmin?: boolean;
}

interface PostItemProps {
  post: ForumPost;
  isReply?: boolean;
  parentId?: string;
  user: User;
  onOpenLogin: () => void;
  handleLike: (postId: string, isReply?: boolean, parentId?: string) => void;
  handleDelete: (postId: string, isReply?: boolean, parentId?: string) => void;
  handlePin?: (postId: string) => void;
  replyingToId: string | null;
  setReplyingToId: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  handleReplySubmit: (parentId: string) => void;
}

const INITIAL_POSTS: ForumPost[] = [
  {
    id: '1',
    author: 'StarGazer_99',
    avatar: 'https://i.pravatar.cc/150?u=1',
    content: 'Just saw Saturn through my new 8-inch Dobsonian. The rings were crystal clear tonight! Anyone else catch the alignment?',
    timestamp: '2 hours ago',
    likes: 24,
    metadata: {
      summary: "An amateur astronomer captures a clear view of Saturn's rings.",
      tags: ["#Saturn", "#Astrophotography", "#Telescope"]
    },
    replies: [
      {
        id: 'r1',
        author: 'Nova (AI)',
        avatar: 'https://i.pravatar.cc/150?u=nova',
        content: 'Saturn is truly the jewel of our solar system. That 8-inch Dobsonian must provide spectacular views!',
        timestamp: '1 hour ago',
        likes: 5,
        replies: []
      }
    ]
  },
  {
    id: '2',
    author: 'VoidSeeker',
    avatar: 'https://i.pravatar.cc/150?u=2',
    content: 'The James Webb images of the Pillars of Creation are absolutely mind-blowing. The detail in the dust clouds is unprecedented.',
    timestamp: '5 hours ago',
    likes: 56,
    metadata: {
      summary: "Reflecting on the incredible detail of JWST's Pillars of Creation imagery.",
      tags: ["#JWST", "#Nebula", "#CosmicDust"]
    },
    replies: []
  }
];

const PostItem: React.FC<PostItemProps> = ({ 
  post, 
  isReply = false, 
  parentId, 
  user, 
  onOpenLogin, 
  handleLike, 
  handleDelete,
  handlePin,
  replyingToId, 
  setReplyingToId, 
  replyText, 
  setReplyText, 
  handleReplySubmit 
}) => (
  <div className={`glass p-6 rounded-2xl flex flex-col gap-4 hover:border-indigo-500/30 transition-all group ${isReply ? 'ml-8 md:ml-12 mt-4 bg-white/5 border-l-2 border-indigo-500/30' : ''} ${post.isPinned ? 'border-2 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : ''}`}>
    <div className="flex gap-4">
      <img src={post.avatar} className={`${isReply ? 'w-10 h-10' : 'w-12 h-12'} rounded-full border-2 border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors`} alt={post.author} />
      <div className="flex-1">
        <div className="flex justify-between mb-2">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            {post.author}
            {post.author.includes('(AI)') && (
              <span className="text-[8px] bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded-full uppercase tracking-widest">Protocol</span>
            )}
            {post.isPinned && (
              <span className="text-[8px] bg-pink-600/30 text-pink-300 px-2 py-0.5 rounded-full uppercase tracking-widest">Pinned</span>
            )}
          </h4>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-500">{post.timestamp}</span>
            {user.isAdmin && (
              <div className="flex gap-2">
                {!isReply && (
                   <button onClick={() => handlePin?.(post.id)} className="text-slate-500 hover:text-pink-400">
                     <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                     </svg>
                   </button>
                )}
                <button onClick={() => handleDelete(post.id, isReply, parentId)} className="text-slate-500 hover:text-red-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-slate-300 text-sm leading-relaxed mb-4">{post.content}</p>
        
        {!isReply && post.metadata && (
          <div className="mb-4 space-y-3 animate-fade-in">
             {post.metadata.summary && (
               <div className="bg-indigo-500/5 border-l-2 border-indigo-500/30 p-3 rounded-r-lg">
                 <p className="text-[11px] text-indigo-300/80 italic leading-snug">
                   <span className="font-bold uppercase tracking-widest mr-2 opacity-60">AI Insight:</span>
                   {post.metadata.summary}
                 </p>
               </div>
             )}
             <div className="flex flex-wrap gap-2">
               {post.metadata.tags.map((tag, idx) => (
                 <span key={idx} className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 group-hover:border-indigo-500/30 group-hover:text-indigo-300 transition-colors">
                   {tag}
                 </span>
               ))}
             </div>
          </div>
        )}

        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <button 
            onClick={() => handleLike(post.id, isReply, parentId)}
            className="hover:text-indigo-400 transition-colors flex items-center gap-1 active:scale-90"
          >
            <svg className="w-3 h-3" fill={post.likes > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Like ({post.likes})
          </button>
          {!isReply && (
            <button 
              onClick={() => {
                if (!user.isLoggedIn) { onOpenLogin(); return; }
                setReplyingToId(replyingToId === post.id ? null : post.id);
              }}
              className={`hover:text-indigo-400 transition-colors ${replyingToId === post.id ? 'text-indigo-400' : ''}`}
            >
              Reply
            </button>
          )}
        </div>

        {replyingToId === post.id && !isReply && (
          <div className="mt-4 animate-fade-in">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none h-20 resize-none mb-2"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setReplyingToId(null)}
                className="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase text-slate-500 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleReplySubmit(post.id)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
              >
                Send Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    
    {post.replies && post.replies.length > 0 && (
      <div className="space-y-2">
        {post.replies.map(reply => (
          <PostItem 
            key={reply.id} 
            post={reply} 
            isReply={true} 
            parentId={post.id} 
            user={user}
            onOpenLogin={onOpenLogin}
            handleLike={handleLike}
            handleDelete={handleDelete}
            replyingToId={replyingToId}
            setReplyingToId={setReplyingToId}
            replyText={replyText}
            setReplyText={setReplyText}
            handleReplySubmit={handleReplySubmit}
          />
        ))}
      </div>
    )}
  </div>
);

const Forum: React.FC<ForumProps> = ({ user, onOpenLogin }) => {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_POSTS);
  const [newPost, setNewPost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleLike = (postId: string, isReply: boolean = false, parentId?: string) => {
    setPosts(prevPosts => {
      return prevPosts.map(post => {
        if (!isReply && post.id === postId) {
          return { ...post, likes: post.likes + 1 };
        } else if (isReply && post.id === parentId) {
          return {
            ...post,
            replies: post.replies.map(reply => 
              reply.id === postId ? { ...reply, likes: reply.likes + 1 } : reply
            )
          };
        }
        return post;
      });
    });
  };

  const handleDelete = (postId: string, isReply: boolean = false, parentId?: string) => {
    if (!user.isAdmin) return;
    setPosts(prev => {
      if (!isReply) return prev.filter(p => p.id !== postId);
      return prev.map(p => p.id === parentId ? { ...p, replies: p.replies.filter(r => r.id !== postId) } : p);
    });
  };

  const handlePin = (postId: string) => {
    if (!user.isAdmin) return;
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isPinned: !p.isPinned } : p));
  };

  const handleReplySubmit = async (parentId: string) => {
    const text = replyText.trim();
    if (!text) return;
    if (!user.isLoggedIn) {
      onOpenLogin();
      return;
    }

    const reply: ForumPost = {
      id: Date.now().toString(),
      author: user.username,
      avatar: user.avatar,
      content: text,
      timestamp: 'Just now',
      likes: 0,
      replies: []
    };

    setPosts(prev => prev.map(p => 
      p.id === parentId ? { ...p, replies: [...p.replies, reply] } : p
    ));
    setReplyText('');
    setReplyingToId(null);

    try {
      const aiResp = await getForumBotResponse(`A user just replied to a thread with: "${text}". Please respond directly to this comment as a friendly AI assistant.`);
      const aiReply: ForumPost = {
        id: (Date.now() + 1).toString(),
        author: 'Nova (AI)',
        avatar: 'https://i.pravatar.cc/150?u=nova',
        content: aiResp,
        timestamp: 'Seconds ago',
        likes: 0,
        replies: []
      };
      
      setTimeout(() => {
        setPosts(prev => prev.map(p => 
          p.id === parentId ? { ...p, replies: [...p.replies, aiReply] } : p
        ));
      }, 1000);
    } catch (err) {
      console.error("AI Reply failed", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    if (!user.isLoggedIn) {
      onOpenLogin();
      return;
    }

    setIsSubmitting(true);
    const postContent = newPost;
    const tempId = Date.now().toString();
    const post: ForumPost = {
      id: tempId,
      author: user.username,
      avatar: user.avatar,
      content: postContent,
      timestamp: 'Transmitting...',
      likes: 0,
      replies: []
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');

    try {
      const [metadata, aiResp] = await Promise.all([
        getPostMetadata(postContent),
        getForumBotResponse(postContent)
      ]);

      const aiReply: ForumPost = {
        id: (Date.now() + 1).toString(),
        author: 'Nova (AI)',
        avatar: 'https://i.pravatar.cc/150?u=nova',
        content: aiResp,
        timestamp: 'Seconds ago',
        likes: 0,
        replies: []
      };

      setPosts(prev => {
        const updated = prev.map(p => p.id === tempId ? { ...p, timestamp: 'Just now', metadata } : p);
        return [aiReply, ...updated];
      });

    } catch (err) {
      console.error("AI Processing failed", err);
      setPosts(prev => prev.map(p => p.id === tempId ? { ...p, timestamp: 'Just now' } : p));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="forum" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <span className="text-indigo-400 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Community Hub</span>
          <h2 className="text-5xl font-bold font-space text-white">The Forum</h2>
        </div>
        <p className="text-slate-400 max-w-sm">
          Join thousands of explorers sharing discoveries, theories, and astrophotography.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl mb-8 relative">
            {!user.isLoggedIn && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-10 rounded-2xl flex flex-col items-center justify-center text-center p-6">
                <p className="text-white font-bold mb-4">You must be logged in to share insights.</p>
                <button 
                  onClick={onOpenLogin}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold transition-all"
                >
                  Join the Mission
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share a thought or discovery..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none h-24 resize-none mb-4"
                disabled={!user.isLoggedIn}
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  {user.isLoggedIn ? `Logged in as ${user.username}` : 'Restricted Access'}
                </span>
                <button 
                  type="submit"
                  disabled={isSubmitting || !user.isLoggedIn}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Analyzing...' : 'Post Message'}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            {posts.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)).map(post => (
              <PostItem 
                key={post.id} 
                post={post} 
                user={user}
                onOpenLogin={onOpenLogin}
                handleLike={handleLike}
                handleDelete={handleDelete}
                handlePin={handlePin}
                replyingToId={replyingToId}
                setReplyingToId={setReplyingToId}
                replyText={replyText}
                setReplyText={setReplyText}
                handleReplySubmit={handleReplySubmit}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
              Trending Topics
            </h3>
            <ul className="space-y-3">
              {['#JWSTUpdate', '#MarsColony', '#ExoplanetHunt', '#DarkMatterTheory'].map(tag => (
                <li key={tag} className="text-sm text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors">
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
              Galactic Weather
            </h3>
            <div className="text-xs space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Solar Flares</span>
                <span className="text-green-400">Low Activity</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cosmic Radiation</span>
                <span className="text-yellow-400">Moderate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Interstellar Dust</span>
                <span className="text-blue-400">Clear Skies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Forum;
