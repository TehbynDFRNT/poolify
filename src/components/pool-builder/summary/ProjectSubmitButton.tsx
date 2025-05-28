import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from 'react';
import { toast } from "sonner";

interface ProjectSubmitButtonProps {
    projectId: string;
}

interface ProjectStatus {
    status: string;
    render_requested?: string;
}

export function ProjectSubmitButton({ projectId }: ProjectSubmitButtonProps) {
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requestRender, setRequestRender] = useState(false);

    // Fetch current project status and render request status
    const { data: projectStatus, isLoading } = useQuery<ProjectStatus | null>({
        queryKey: ['project-status', projectId],
        queryFn: async () => {
            if (!projectId) return null;

            try {
                // Get proposal status
                const { data: proposalData, error: proposalError } = await supabase
                    .from('pool_proposal_status')
                    .select('status')
                    .eq('pool_project_id', projectId)
                    .single();

                if (proposalError) {
                    console.error("Error fetching proposal status:", proposalError);
                    return null;
                }

                // Get render request status from pool_projects using raw query
                const { data: projectData, error: projectError } = await supabase
                    .from('pool_projects')
                    .select('render_requested')
                    .eq('id', projectId)
                    .single();

                if (projectError) {
                    console.error("Error fetching project data:", projectError);
                    return null;
                }

                return {
                    status: proposalData.status,
                    render_requested: (projectData as any)?.render_requested
                };
            } catch (error) {
                console.error("Error in project status query:", error);
                return null;
            }
        },
        enabled: !!projectId,
    });

    // Handle project submission
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Update the proposal status to "sent"
            const { error: statusError } = await supabase
                .from('pool_proposal_status')
                .update({ status: 'sent' })
                .eq('pool_project_id', projectId);

            if (statusError) {
                throw statusError;
            }

            // Handle render request if checkbox is checked
            if (requestRender) {
                const { error: renderError } = await supabase
                    .from('pool_projects')
                    .update({ render_requested: new Date().toISOString() } as any)
                    .eq('id', projectId);

                if (renderError) {
                    throw renderError;
                }
            }

            setSubmitDialogOpen(false);
            toast.success("Project Submitted", {
                description: requestRender
                    ? "The project has been successfully submitted and a 3D render has been requested."
                    : "The project has been successfully submitted."
            });
        } catch (error) {
            console.error("Error submitting project:", error);
            toast.error("Error", {
                description: "There was an error submitting the project."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Determine dialog content based on current status
    const getDialogContent = () => {
        if (!projectStatus) return null;

        const isCreated = projectStatus.status === 'created';
        const hasRenderRequested = !!projectStatus.render_requested;

        return {
            title: "Submit Project",
            description: isCreated
                ? "This will send the proposal to the customer."
                : "Submitting this proposal will cause the status to reset and the end customer will need to re-accept the proposal if they have already accepted it.",
            checkboxLabel: isCreated
                ? "Request 3D render"
                : hasRenderRequested
                    ? "Request new 3D render for this project"
                    : "Request 3D render"
        };
    };

    const dialogContent = getDialogContent();

    return (
        <>
            <Button
                variant="default"
                className="bg-primary hover:bg-primary/90"
                onClick={() => setSubmitDialogOpen(true)}
                disabled={isLoading}
            >
                Submit
            </Button>

            {/* Submit Dialog */}
            <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dialogContent?.title}</DialogTitle>
                        <DialogDescription>
                            {dialogContent?.description}
                        </DialogDescription>
                    </DialogHeader>

                    {dialogContent && (
                        <div className="flex items-center space-x-2 py-4">
                            <Checkbox
                                id="request-render"
                                checked={requestRender}
                                onCheckedChange={(checked) => setRequestRender(checked === true)}
                            />
                            <label
                                htmlFor="request-render"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {dialogContent.checkboxLabel}
                            </label>
                        </div>
                    )}

                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setSubmitDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
} 