import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectToDatabase();

        // Find user by email
        const user = await User.findOne({ email: credentials.email });
        
        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          return null;
        }

        // Return user object (without password)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || 'user',
          image: user.image
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to the token if user object is available
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to the session user object from token
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Export the handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
