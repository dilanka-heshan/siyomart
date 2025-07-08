"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Question {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  question: string;
  answer?: {
    text: string;
    answeredBy: string;
    answeredAt: string;
  };
  createdAt: string;
}

interface ProductQuestionsProps {
  productId: string;
}

export default function ProductQuestions({ productId }: ProductQuestionsProps) {
  // For demonstration, we'll use dummy data
  const [questions, setQuestions] = useState<Question[]>([
    {
      _id: '1',
      userId: {
        _id: 'user1',
        name: 'John D.',
      },
      question: 'Is this product suitable for outdoor use?',
      answer: {
        text: 'Yes, this product is designed for both indoor and outdoor use. It has weather-resistant properties.',
        answeredBy: 'Seller',
        answeredAt: '2023-10-15T10:30:00Z',
      },
      createdAt: '2023-10-12T15:20:00Z',
    },
    {
      _id: '2',
      userId: {
        _id: 'user2',
        name: 'Sarah M.',
      },
      question: 'What are the dimensions of this product?',
      answer: {
        text: 'The dimensions are 30cm x 20cm x 15cm (LxWxH).',
        answeredBy: 'Seller',
        answeredAt: '2023-10-05T09:45:00Z',
      },
      createdAt: '2023-10-02T14:10:00Z',
    }
  ]);
  
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("Please log in to ask a question");
      router.push('/login');
      return;
    }
    
    if (!newQuestion.trim()) {
      toast.error("Please enter your question");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you'd make an API call to save the question
      // For now, we'll just update the local state
      console.log('Submitting question for product:', productId);
      
      const question: Question = {
        _id: Date.now().toString(),
        userId: {
          _id: session.user?.id || '',
          name: session.user?.name || 'Anonymous',
        },
        question: newQuestion,
        createdAt: new Date().toISOString(),
      };
      
      setQuestions(prev => [question, ...prev]);
      setNewQuestion('');
      setShowQuestionForm(false);
      toast.success("Your question has been submitted");
    } catch (error) {
      toast.error("Failed to submit question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div>
      {/* Ask a Question Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowQuestionForm(!showQuestionForm)}
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
        >
          {showQuestionForm ? 'Cancel' : 'Ask a Question'}
        </button>
      </div>
      
      {/* Question Form */}
      {showQuestionForm && (
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Ask About This Product</h3>
          <form onSubmit={handleSubmitQuestion}>
            <div className="mb-4">
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Your Question
              </label>
              <textarea
                id="question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Ask about size, features, compatibility..."
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Question'}
            </button>
          </form>
        </div>
      )}
      
      {/* Questions List */}
      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <div key={question._id} className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <QuestionMarkCircleIcon className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">{question.question}</p>
                  <p className="text-sm text-gray-500">
                    {question.userId.name} - {formatDate(question.createdAt)}
                  </p>
                </div>
              </div>
              
              {question.answer && (
                <div className="ml-9 bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-700">{question.answer.text}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {question.answer.answeredBy} - {formatDate(question.answer.answeredAt)}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            No questions yet. Be the first to ask about this product!
          </p>
        )}
      </div>
    </div>
  );
}
