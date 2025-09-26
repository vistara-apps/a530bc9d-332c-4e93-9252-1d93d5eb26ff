import { NextRequest, NextResponse } from 'next/server';
import { courseDb, progressDb, userDb, analyticsDb } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const walletAddress = searchParams.get('walletAddress');

    if (courseId) {
      // Get specific course modules
      const modules = await courseDb.getCourseModules(courseId);

      // If wallet address provided, include progress
      if (walletAddress) {
        const user = await userDb.get(walletAddress);
        if (user) {
          const progress = await progressDb.get(user.userId, courseId);
          if (progress) {
            const modulesWithProgress = modules.map(module => ({
              ...module,
              isCompleted: progress.completedModules.includes(module.moduleId),
              isCurrent: progress.currentModule === module.moduleId,
            }));
            return NextResponse.json({ modules: modulesWithProgress, progress });
          }
        }
      }

      return NextResponse.json({ modules });
    } else {
      // Get all available modules
      const modules = await courseDb.getAllModules();
      return NextResponse.json({ modules });
    }

  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, moduleId, courseId, walletAddress, quizScore } = await request.json();

    if (!action || !walletAddress) {
      return NextResponse.json(
        { error: 'Action and wallet address are required' },
        { status: 400 }
      );
    }

    const user = await userDb.get(walletAddress);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'start_course') {
      if (!courseId) {
        return NextResponse.json(
          { error: 'Course ID is required for start_course action' },
          { status: 400 }
        );
      }

      let progress = await progressDb.get(user.userId, courseId);
      if (!progress) {
        progress = await progressDb.create(user.userId, courseId);
      }

      // Log analytics
      await analyticsDb.logEvent({
        eventId: `start_course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.userId,
        eventType: 'course_started',
        eventData: { courseId },
        timestamp: new Date(),
        sessionId: `session_${user.userId}_${Date.now()}`,
      });

      return NextResponse.json({ progress });

    } else if (action === 'complete_module') {
      if (!moduleId || !courseId) {
        return NextResponse.json(
          { error: 'Module ID and course ID are required for complete_module action' },
          { status: 400 }
        );
      }

      let progress = await progressDb.get(user.userId, courseId);
      if (!progress) {
        progress = await progressDb.create(user.userId, courseId);
      }

      if (!progress.completedModules.includes(moduleId)) {
        progress.completedModules.push(moduleId);
      }

      // Set next module as current
      const modules = await courseDb.getCourseModules(courseId);
      const currentIndex = modules.findIndex(m => m.moduleId === moduleId);
      if (currentIndex < modules.length - 1) {
        progress.currentModule = modules[currentIndex + 1].moduleId;
      }

      await progressDb.set(progress);

      // Check if course is completed
      const allModules = modules.map(m => m.moduleId);
      const isCourseCompleted = allModules.every(id => progress.completedModules.includes(id));

      if (isCourseCompleted && !user.completedCourses.includes(courseId)) {
        user.completedCourses.push(courseId);
        await userDb.update(user.userId, { completedCourses: user.completedCourses });

        // Log course completion
        await analyticsDb.logEvent({
          eventId: `complete_course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.userId,
          eventType: 'course_completed',
          eventData: { courseId },
          timestamp: new Date(),
          sessionId: `session_${user.userId}_${Date.now()}`,
        });
      }

      // Log module completion
      await analyticsDb.logEvent({
        eventId: `complete_module_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.userId,
        eventType: 'module_completed',
        eventData: { moduleId, courseId },
        timestamp: new Date(),
        sessionId: `session_${user.userId}_${Date.now()}`,
      });

      return NextResponse.json({
        progress,
        courseCompleted: isCourseCompleted
      });

    } else if (action === 'submit_quiz') {
      if (!moduleId || !courseId || quizScore === undefined) {
        return NextResponse.json(
          { error: 'Module ID, course ID, and quiz score are required for submit_quiz action' },
          { status: 400 }
        );
      }

      let progress = await progressDb.get(user.userId, courseId);
      if (!progress) {
        progress = await progressDb.create(user.userId, courseId);
      }

      progress.quizScores[moduleId] = quizScore;
      await progressDb.set(progress);

      // Log quiz submission
      await analyticsDb.logEvent({
        eventId: `quiz_submit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.userId,
        eventType: 'quiz_submitted',
        eventData: { moduleId, courseId, score: quizScore },
        timestamp: new Date(),
        sessionId: `session_${user.userId}_${Date.now()}`,
      });

      return NextResponse.json({ progress });

    } else if (action === 'update_progress') {
      if (!courseId || !moduleId) {
        return NextResponse.json(
          { error: 'Course ID and module ID are required for update_progress action' },
          { status: 400 }
        );
      }

      let progress = await progressDb.get(user.userId, courseId);
      if (!progress) {
        progress = await progressDb.create(user.userId, courseId);
      }

      progress.currentModule = moduleId;
      await progressDb.set(progress);

      return NextResponse.json({ progress });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Course action error:', error);
    return NextResponse.json(
      { error: 'Failed to process course action' },
      { status: 500 }
    );
  }
}

