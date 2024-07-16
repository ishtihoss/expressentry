import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StepGuide } from '@/components/StepGuide';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

const steps = [
  {
    title: "1. Assess Eligibility",
    tasks: [{ id: 0, description: "Use the Come to Canada tool to determine eligibility." }],
    milestone: "Confirm eligibility for at least one of the Express Entry programs."
  },
  {
    title: "2. Collect Necessary Documents",
    tasks: [
      { id: 0, description: "Gather passport" },
      { id: 1, description: "Obtain proof of funds" },
      { id: 2, description: "Collect work experience letters" },
      { id: 3, description: "Acquire police clearance certificates" },
      { id: 4, description: "Complete medical examination" }
    ],
    milestone: "Gather and organize all initial documentation."
  },
  {
    title: "3. Educational Credential Assessment (ECA)",
    tasks: [{ id: 0, description: "Apply for an ECA from a recognized institution (WES, ICAS, IQAS, etc.)." }],
    milestone: "Receive ECA report."
  },
  {
    title: "4. Language Proficiency Test",
    tasks: [
      { id: 0, description: "Schedule English (IELTS or CELPIP) or French (TEF or TCF) test" },
      { id: 1, description: "Prepare for the language test" },
      { id: 2, description: "Take the language test" }
    ],
    milestone: "Achieve required language test scores."
  },
  {
    title: "5. Create an Express Entry Profile",
    tasks: [{ id: 0, description: "Enter all collected information into the Express Entry system." }],
    milestone: "Successfully submit the profile to the Express Entry pool."
  },
  {
    title: "6. Improve CRS Score",
    tasks: [
      { id: 0, description: "Enhance language test scores" },
      { id: 1, description: "Gain additional work experience or qualifications" },
      { id: 2, description: "Apply for a provincial nomination" }
    ],
    milestone: "Monitor CRS score improvements and update profile as necessary."
  },
  {
    title: "7. Receive Invitation to Apply (ITA)",
    tasks: [
      { id: 0, description: "Monitor for an ITA" },
      { id: 1, description: "Prepare to respond quickly" }
    ],
    milestone: "Receive ITA from IRCC."
  },
  {
    title: "8. Submit Permanent Residence Application",
    tasks: [
      { id: 0, description: "Complete the application" },
      { id: 1, description: "Upload all required documents" },
      { id: 2, description: "Pay the fees" }
    ],
    milestone: "Submit a complete and accurate application within the 60-day window."
  },
  {
    title: "9. Medical and Security Checks",
    tasks: [
      { id: 0, description: "Complete medical exams" },
      { id: 1, description: "Obtain police clearance certificates" }
    ],
    milestone: "Submit medical and security clearances."
  },
  {
    title: "10. Continuous Monitoring and Updates",
    tasks: [
      { id: 0, description: "Regularly check the application status" },
      { id: 1, description: "Respond promptly to any IRCC requests" }
    ],
    milestone: "Ensure application processing progresses without delays."
  },
  {
    title: "11. Receive Confirmation of Permanent Residence (COPR)",
    tasks: [
      { id: 0, description: "Await COPR" },
      { id: 1, description: "Receive COPR" }
    ],
    milestone: "Obtain COPR and prepare for the move to Canada."
  },
  {
    title: "12. Prepare for Landing in Canada",
    tasks: [
      { id: 0, description: "Finalize housing arrangements" },
      { id: 1, description: "Research employment opportunities" },
      { id: 2, description: "Plan logistics for the move" }
    ],
    milestone: "Successfully settle in Canada."
  }
];

export default function ExpressEntryGuide() {
    const [isSaving, setIsSaving] = useState(false);
    const [completedTasks, setCompletedTasks] = useState<{[key: number]: number[]}>({});
    const [isLoading, setIsLoading] = useState(true);
    const [subscription, setSubscription] = useState(null);
    const user = useUser();
    const supabase = useSupabaseClient();
    const router = useRouter();
  
    useEffect(() => {
      const checkUserAndSubscription = async () => {
        if (!user) {
          router.push('/SignIn');
          return;
        }

        // Check subscription
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch("/api/subscription", {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        const data = await res.json();

        if (data.isSubscribed) {
          setSubscription(data.subscription);
          fetchCompletedTasks();
        } else {
          router.push('/');  // Redirect non-subscribers back to home
        }
      };

      checkUserAndSubscription();
    }, [user, router, supabase]);
  
    const fetchCompletedTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('completed_tasks')
          .select('completed_tasks')
          .eq('user_id', user.id)
          .single();
    
        if (error) throw error;
    
        if (data && data.completed_tasks) {
          setCompletedTasks(data.completed_tasks);
        } else {
          setCompletedTasks({});
        }
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
        setCompletedTasks({});
      } finally {
        setIsLoading(false);
      }
    };

    const handleTaskCompletion = async (stepIndex: number, taskIndex: number) => {
      if (!user) return;
    
      const newCompletedTasks = { ...completedTasks };
      if (!newCompletedTasks[stepIndex]) {
        newCompletedTasks[stepIndex] = [];
      }
    
      const taskIndexInArray = newCompletedTasks[stepIndex].indexOf(taskIndex);
      if (taskIndexInArray > -1) {
        newCompletedTasks[stepIndex] = newCompletedTasks[stepIndex].filter(index => index !== taskIndex);
      } else {
        newCompletedTasks[stepIndex].push(taskIndex);
      }
    
      setCompletedTasks(newCompletedTasks);
    
      try {
        setIsSaving(true);
        const { error } = await supabase
          .from('completed_tasks')
          .upsert({ 
            user_id: user.id, 
            completed_tasks: newCompletedTasks 
          }, { 
            onConflict: 'user_id' 
          });
    
        if (error) throw error;
        console.log("Task completion status updated successfully");
      } catch (error) {
        console.error('Error updating completed tasks:', error);
      } finally {
        setIsSaving(false);
      }
    };
    

  const saveProgress = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
        const response = await fetch('/api/save-progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completedTasks, userId: user.id }),
        });
        if (!response.ok) throw new Error('Failed to save progress');
        // Optionally show a success message
    } catch (error) {
        console.error('Error saving progress:', error);
        // Optionally show an error message
    } finally {
        setIsSaving(false);
    }
};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !subscription) {
    return null; // The ProtectedRoute component will handle the redirection
  }

  return (
    <>
      <Head>
        <title>Express Entry Interactive Guide</title>
        <meta name="description" content="Interactive step-by-step guide for the Express Entry process" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />

        <main className="flex-grow p-4">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center">Express Entry Interactive Guide</h1>
            <StepGuide steps={steps} completedTasks={completedTasks} onTaskCompletion={handleTaskCompletion} />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}