#!/bin/bash
# make-functions-public.sh
# Makes Cloud Functions publicly callable (needed for client-side calls)

PROJECT_ID="stuga-dev"
REGION="europe-north1"

echo "🔓 Making Cloud Functions publicly callable..."
echo ""

# List of callable functions
FUNCTIONS=(
  "calculateReputation"
  "recalculateAllReputations"
)

for FUNCTION in "${FUNCTIONS[@]}"; do
  echo "Setting invoker for: $FUNCTION"
  
  gcloud functions add-iam-policy-binding $FUNCTION \
    --region=$REGION \
    --member="allUsers" \
    --role="roles/cloudfunctions.invoker" \
    --project=$PROJECT_ID
  
  if [ $? -eq 0 ]; then
    echo "✅ $FUNCTION is now publicly callable"
  else
    echo "❌ Failed to set invoker for $FUNCTION"
  fi
  echo ""
done

echo "🎉 All callable functions are now public!"
echo ""
echo "Note: Trigger functions (onDocumentUpdated) don't need this,"
echo "they're automatically triggered by Firestore events."
