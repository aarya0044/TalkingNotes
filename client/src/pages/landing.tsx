export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-primary-foreground font-bold text-2xl">TN</span>
          </div>
          <h1 className="text-5xl font-light text-foreground mb-4 tracking-tight">
            TALKING NOTES
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            A safe space for your thoughts, emotions, and creative expression. 
            Write notes, create poems, and find comfort through conversation.
          </p>
        </div>

        <div className="bg-card rounded-3xl p-8 shadow-2xl border border-border mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Your personal sanctuary for
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-medium text-foreground mb-2">Private Notes</h3>
              <p className="text-sm text-muted-foreground">
                Write your thoughts, memories, and stories in complete privacy
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="font-medium text-foreground mb-2">Poetry</h3>
              <p className="text-sm text-muted-foreground">
                Express yourself through verse with inspiration prompts
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-medium text-foreground mb-2">Comfort Chat</h3>
              <p className="text-sm text-muted-foreground">
                Find support and understanding through compassionate conversation
              </p>
            </div>
          </div>

          <a 
            href="/api/login"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            data-testid="button-login"
          >
            <span>Begin Your Journey</span>
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            🔒 All your data is encrypted and secure. Only you can access your thoughts and writings.
          </p>
        </div>
      </div>
    </div>
  );
}