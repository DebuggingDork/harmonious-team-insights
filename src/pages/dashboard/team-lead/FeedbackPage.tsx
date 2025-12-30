import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Search,
  Filter,
  X,
  Edit,
  Trash2,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { TeamLeadLayout } from "@/components/layouts/TeamLeadLayout";
import { useMyTeams } from "@/hooks/useEmployee";
import {
  useTeamPerformance,
  useMemberObservations,
  useCreateObservation,
  useUpdateObservation,
  useDeleteObservation,
} from "@/hooks/useTeamLead";
import { toast } from "@/hooks/use-toast";
import type { ObservationCategory, ObservationRating, Observation } from "@/api/types";
import { format } from "date-fns";

const FeedbackPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedMemberCode, setSelectedMemberCode] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<ObservationCategory>("collaboration");
  const [selectedRating, setSelectedRating] = useState<ObservationRating>("positive");
  const [filterMemberCode, setFilterMemberCode] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [editingObservation, setEditingObservation] = useState<Observation | null>(null);
  const [deletingObservation, setDeletingObservation] = useState<Observation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get teams
  const { data: teamsData, isLoading: isLoadingTeams } = useMyTeams();
  const teamCode = useMemo(() => {
    if (teamsData?.teams && teamsData.teams.length > 0) {
      return teamsData.teams[0].team_code;
    }
    return null;
  }, [teamsData]);

  // Get team performance to get member list
  const dateRanges = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    return {
      period_start: startDate.toISOString().split('T')[0],
      period_end: endDate.toISOString().split('T')[0],
    };
  }, []);

  const { data: teamPerformance, isLoading: isLoadingPerformance } = useTeamPerformance(
    teamCode || "",
    dateRanges
  );

  // Get member activity data
  const memberActivityData = useMemo(() => {
    if (!teamPerformance?.members) return [];
    return teamPerformance.members.map((member) => ({
      name: member.user_name,
      userCode: member.user_code,
    }));
  }, [teamPerformance]);

  // Get observations for all members (we'll fetch for the first member or selected member)
  const memberCodeToFetch = filterMemberCode !== "all" 
    ? filterMemberCode 
    : (selectedMemberCode || (memberActivityData.length > 0 ? memberActivityData[0].userCode : ""));
  
  const { data: observationsData, isLoading: isLoadingObservations } = useMemberObservations(
    teamCode || "",
    memberCodeToFetch,
    { page: 1, limit: 100 }
  );

  // Mutations
  const createObservationMutation = useCreateObservation();
  const updateObservationMutation = useUpdateObservation();
  const deleteObservationMutation = useDeleteObservation();

  // Filter observations
  const filteredObservations = useMemo(() => {
    if (!observationsData?.observations) return [];
    
    let filtered = observationsData.observations;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (obs) =>
          obs.note.toLowerCase().includes(query) ||
          obs.user_name.toLowerCase().includes(query) ||
          obs.category.toLowerCase().includes(query)
      );
    }

    // Member filter
    if (filterMemberCode !== "all") {
      filtered = filtered.filter((obs) => obs.user_code === filterMemberCode);
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((obs) => obs.category === filterCategory);
    }

    // Rating filter
    if (filterRating !== "all") {
      filtered = filtered.filter((obs) => obs.rating === filterRating);
    }

    return filtered;
  }, [observationsData, searchQuery, filterMemberCode, filterCategory, filterRating]);

  const handleCreateFeedback = async () => {
    if (!teamCode || !selectedMemberCode || !feedbackText.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select a team member and enter feedback text.",
        variant: "destructive",
      });
      return;
    }

    createObservationMutation.mutate(
      {
        teamCode,
        userCode: selectedMemberCode,
        data: {
          category: selectedCategory,
          rating: selectedRating,
          note: feedbackText,
          observation_date: new Date().toISOString().split('T')[0],
        },
      },
      {
        onSuccess: () => {
          setFeedbackText("");
          setSelectedMemberCode("");
          setSelectedCategory("collaboration");
          setSelectedRating("positive");
          toast({
            title: "Success",
            description: "Feedback created successfully.",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error?.response?.data?.message || "Failed to create feedback.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleEditObservation = (observation: Observation) => {
    setEditingObservation(observation);
    setFeedbackText(observation.note);
    setSelectedCategory(observation.category);
    setSelectedRating(observation.rating);
    setSelectedMemberCode(observation.user_code);
    setIsEditDialogOpen(true);
  };

  const handleUpdateObservation = async () => {
    if (!editingObservation || !feedbackText.trim()) {
      return;
    }

    updateObservationMutation.mutate(
      {
        observationCode: editingObservation.observation_code,
        data: {
          category: selectedCategory,
          rating: selectedRating,
          note: feedbackText,
        },
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setEditingObservation(null);
          setFeedbackText("");
          setSelectedMemberCode("");
          setSelectedCategory("collaboration");
          setSelectedRating("positive");
          toast({
            title: "Success",
            description: "Feedback updated successfully.",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error?.response?.data?.message || "Failed to update feedback.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteObservation = (observation: Observation) => {
    setDeletingObservation(observation);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteObservation = async () => {
    if (!deletingObservation) return;

    deleteObservationMutation.mutate(deletingObservation.observation_code, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setDeletingObservation(null);
        toast({
          title: "Success",
          description: "Feedback deleted successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error?.response?.data?.message || "Failed to delete feedback.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <TeamLeadLayout
      headerTitle="Feedback Management"
      headerDescription="Create and manage feedback for your team members"
    >
      <div className="space-y-6">
        {/* Create Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!teamCode ? (
              <p className="text-center text-muted-foreground py-4">No team assigned</p>
            ) : memberActivityData.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No team members available</p>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">Team Member *</label>
                  <Select value={selectedMemberCode} onValueChange={setSelectedMemberCode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {memberActivityData.map((member) => (
                        <SelectItem key={member.userCode} value={member.userCode}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => setSelectedCategory(value as ObservationCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="quality">Quality</SelectItem>
                        <SelectItem value="collaboration">Collaboration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-foreground">Rating</label>
                    <Select
                      value={selectedRating}
                      onValueChange={(value) => setSelectedRating(value as ObservationRating)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">Feedback Note *</label>
                  <Textarea
                    placeholder="Write supportive feedback for a team member..."
                    className="min-h-[100px]"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleCreateFeedback}
                  disabled={!selectedMemberCode || !feedbackText.trim() || createObservationMutation.isPending}
                  className="w-full"
                >
                  {createObservationMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Feedback"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search feedback..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterMemberCode} onValueChange={setFilterMemberCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {memberActivityData.map((member) => (
                    <SelectItem key={member.userCode} value={member.userCode}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="collaboration">Collaboration</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
              {(searchQuery || filterMemberCode !== "all" || filterCategory !== "all" || filterRating !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterMemberCode("all");
                    setFilterCategory("all");
                    setFilterRating("all");
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feedback History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Feedback History ({filteredObservations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingObservations || isLoadingPerformance || isLoadingTeams ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredObservations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">
                {searchQuery || filterMemberCode !== "all" || filterCategory !== "all" || filterRating !== "all"
                  ? "No feedback found matching the filters."
                  : "No feedback has been created yet. Start by adding feedback above."}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredObservations.map((observation) => (
                  <motion.div
                    key={observation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-accent/30 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-foreground">{observation.user_name}</span>
                          <Badge
                            variant={
                              observation.rating === "positive"
                                ? "default"
                                : observation.rating === "neutral"
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {observation.rating}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {observation.category}
                          </Badge>
                          {observation.related_task_title && (
                            <Badge variant="outline" className="text-xs">
                              Task: {observation.related_task_code}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground mb-2">{observation.note}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            {format(new Date(observation.observation_date), "MMM d, yyyy")}
                          </span>
                          <span>•</span>
                          <span>
                            {format(new Date(observation.created_at), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditObservation(observation)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteObservation(observation)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Feedback Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Feedback</DialogTitle>
            <DialogDescription>Update the feedback details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as ObservationCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="collaboration">Collaboration</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedRating}
                onValueChange={(value) => setSelectedRating(value as ObservationRating)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Feedback note..."
              className="min-h-[100px]"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingObservation(null);
                setFeedbackText("");
                setSelectedMemberCode("");
                setSelectedCategory("collaboration");
                setSelectedRating("positive");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateObservation}
              disabled={!feedbackText.trim() || updateObservationMutation.isPending}
            >
              {updateObservationMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Feedback"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingObservation(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteObservation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteObservationMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TeamLeadLayout>
  );
};

export default FeedbackPage;


