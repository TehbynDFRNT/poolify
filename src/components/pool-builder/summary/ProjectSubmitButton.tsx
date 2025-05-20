import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { PoolProject } from "@/types/pool";
import { useState } from 'react';
import { toast } from "sonner";

interface ProjectSubmitButtonProps {
    projectId: string;
}

export function ProjectSubmitButton({ projectId }: ProjectSubmitButtonProps) {
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
    const [renderRequestDialogOpen, setRenderRequestDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle project submission
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Update the project status to "sent"
            const { data, error } = await supabase
                .from('pool_projects')
                .update({
                    status: 'sent'
                } as Partial<PoolProject>)
                .eq('id', projectId);

            if (error) {
                throw error;
            }

            setSubmitDialogOpen(false);
            setRenderRequestDialogOpen(true);
            toast.success("Project Submitted", {
                description: "The project has been successfully marked as sent."
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

    // Handle 3D render request
    const handleRenderRequest = async (requested: boolean) => {
        try {
            if (requested) {
                // Set the render_requested timestamp to now (UTC)
                const { data, error } = await supabase
                    .from('pool_projects')
                    .update({
                        render_requested: new Date().toISOString()
                    } as Partial<PoolProject>)
                    .eq('id', projectId);

                if (error) {
                    throw error;
                }

                toast.success("Render Requested", {
                    description: "A 3D render has been requested for this project."
                });
            }
        } catch (error) {
            console.error("Error requesting render:", error);
            toast.error("Error", {
                description: "There was an error processing your render request."
            });
        } finally {
            setRenderRequestDialogOpen(false);
        }
    };

    return (
        <>
            <Button
                variant="default"
                className="bg-primary hover:bg-primary/90"
                onClick={() => setSubmitDialogOpen(true)}
            >
                Submit
            </Button>

            {/* Submit Dialog */}
            <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Project</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to submit this project? This will mark the project as sent.
                        </DialogDescription>
                    </DialogHeader>
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

            {/* 3D Render Request Dialog */}
            <Dialog open={renderRequestDialogOpen} onOpenChange={setRenderRequestDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>3D Render Request</DialogTitle>
                        <DialogDescription>
                            Would you like to request a 3D render for this project?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => handleRenderRequest(false)}
                        >
                            No
                        </Button>
                        <Button
                            onClick={() => handleRenderRequest(true)}
                        >
                            Yes, Request 3D Render
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
} 