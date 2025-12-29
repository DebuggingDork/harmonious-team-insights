import { motion } from "framer-motion";
import { useMemo } from "react";
import { 
  MessageSquare,
  Calendar,
  User,
  Loader2,
  Star,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMyObservations } from "@/hooks/useEmployee";
import { format } from "date-fns";
import type { Observation } from "@/api/types";

const MyFeedback = () => {
  const { data: observationsData, isLoading } = useMyObservations();
  const observations = observationsData?.observations || [];

  // Group feedback by category and rating
  const feedbackSummary = useMemo(() => {
    const summary = {
      total: observations.length,
      byCategory: {} as Record<string, number>,
      byRating: {} as Record<string, number>,
    };

    observations.forEach((obs: Observation) => {
      // Count by category
      if (!summary.byCategory[obs.category]) {
        summary.byCategory[obs.category] = 0;
      }
      summary.byCategory[obs.category]++;

      // Count by rating
      if (!summary.byRating[obs.rating]) {
        summary.byRating[obs.rating] = 0;
      }
      summary.byRating[obs.rating]++;
    });

    return summary;
  }, [observations]);

  // Sort observations by date (newest first)
  const sortedObservations = useMemo(() => {
    return [...observations].sort((a, b) => 
      new Date(b.observation_date).getTime() - new Date(a.observation_date).getTime()
    );
  }, [observations]);

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'neutral': return <Minus className="h-4 w-4 text-yellow-500" />;
      default: return <Star className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'positive': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'negative': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'neutral': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technical: 'bg-blue-500/10 text-blue-500',
      communication: 'bg-purple-500/10 text-purple-500',
      leadership: 'bg-orange-500/10 text-orange-500',
      delivery: 'bg-green-500/10 text-green-500',
      quality: 'bg-indigo-500/10 text-indigo-500',
      collaboration: 'bg-pink-500/10 text-pink-500',
    };
    return colors[category as keyof typeof colors] || 'bg-muted-foreground/10 text-muted-foreground';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Feedback Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Total Feedback</p>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : feedbackSummary.total}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Positive</p>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : feedbackSummary.byRating.positive || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Categories</p>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Star className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : Object.keys(feedbackSummary.byCategory).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback by Category */}
      {!isLoading && Object.keys(feedbackSummary.byCategory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Feedback by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(feedbackSummary.byCategory).map(([category, count]) => (
                <div key={category} className="p-3 bg-accent/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground capitalize">
                      {category.replace('_', ' ')}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Feedback History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sortedObservations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No feedback yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your team lead hasn't provided any feedback yet. Feedback will appear here when available.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedObservations.map((observation: Observation, index) => (
                <motion.div
                  key={observation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${getRatingColor(observation.rating)}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {observation.evaluator_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {observation.evaluator_role || 'Team Lead'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRatingIcon(observation.rating)}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(observation.observation_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCategoryColor(observation.category)}`}
                      >
                        {observation.category.replace('_', ' ')}
                      </Badge>
                      {observation.related_task_title && (
                        <Badge variant="outline" className="text-xs">
                          Task: {observation.related_task_title}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-foreground leading-relaxed">
                      {observation.note}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guidance */}
      <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">About Your Feedback</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Feedback is provided by your team lead to help you grow and improve</p>
                <p>• All feedback is constructive and aimed at supporting your development</p>
                <p>• You can discuss any feedback with your team lead during regular check-ins</p>
                <p>• This information is private and only visible to you and your team lead</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MyFeedback;