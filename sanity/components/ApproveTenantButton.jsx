import {
  Button,
  Card,
  Stack,
  Text,
  Flex,
  Dialog,
  Box,
  TextArea,
} from "@sanity/ui";
import { useState } from "react";
import { useClient } from "sanity";

export function ApproveTenantButton({ document }) {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  if (!document || document._type !== "tenantRequest") {
    return null;
  }

  if (document.status !== "pending") {
    return (
      <Card padding={3} radius={2} shadow={1} tone="default">
        <Text size={1}>
          Status: <strong>{document.status}</strong>
          {document.createdTenantId && (
            <> (Tenant ID: {document.createdTenantId})</>
          )}
          {document.status === "rejected" && document.rejectionReason && (
            <>
              <br />
              Reason: {document.rejectionReason}
            </>
          )}
        </Text>
      </Card>
    );
  }

  const handleAction = async (action) => {
    const actionText = action === "approve" ? "approve" : "reject";

    try {
      // show global processing state immediately so buttons and dialogs reflect the work in progress
      setLoading(true);
      const token = client.config().token;

      const response = await fetch("/api/admin/approve-tenant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantRequestId: document._id,
          action,
          rejectionReason: action === "reject" ? rejectionReason : undefined,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        data = { error: text || "Invalid response from server" };
      }

      if (response.ok) {
        setResult({ success: true, message: data.message });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setResult({
          success: false,
          message: data.error || `Failed to ${actionText}`,
        });
      }
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
      setShowRejectDialog(false);
      setShowApproveDialog(false);
    }
  };

  return (
    <>
      <Card padding={3} radius={2} shadow={1} tone="primary">
        <Stack space={5}>
          <Text size={2} weight="semibold">
            Tenant Request Actions
          </Text>
          <Flex gap={2}>
            <Button
              tone="positive"
              text="Approve"
              style={{ cursor: "pointer", flex: "0 0 50%" }}
              onClick={() => setShowApproveDialog(true)}
              loading={loading}
              disabled={loading}
            />
            <Button
              tone="critical"
              text="Reject"
              style={{ cursor: "pointer", flex: "0 0 50%" }}
              onClick={() => setShowRejectDialog(true)}
              disabled={loading}
            />
          </Flex>
          {result && (
            <Card padding={2} tone={result.success ? "positive" : "critical"}>
              <Text size={1}>{result.message}</Text>
            </Card>
          )}
        </Stack>
      </Card>

      {showRejectDialog && (
        <Dialog
          header="Reject Tenant Request"
          id="reject-dialog"
          onClose={() => setShowRejectDialog(false)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={2}>
                Rejecting: <strong>{document.name}</strong>
              </Text>
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  Rejection Reason (optional):
                </Text>
                <TextArea
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection (will be sent to the applicant)"
                />
              </Stack>
              <Flex gap={2} justify="flex-end">
                <Button
                  text="Cancel"
                  mode="ghost"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowRejectDialog(false)}
                />
                <Button
                  text="Confirm Rejection"
                  tone="critical"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleAction("reject")}
                  loading={loading}
                  disabled={loading}
                />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}

      {showApproveDialog && (
        <Dialog
          header="Approve Tenant Request"
          id="approve-dialog"
          onClose={() => setShowApproveDialog(false)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={2}>
                Approving: <strong>{document.name}</strong>
              </Text>
              <Text size={1}>
                Are you sure you want to approve and create this{" "}
                {document.tenantType}?
              </Text>
              <Flex gap={2} justify="flex-end">
                <Button
                  text="Cancel"
                  mode="ghost"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowApproveDialog(false)}
                />
                <Button
                  text="Confirm Approve"
                  tone="positive"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowApproveDialog(false);
                    handleAction("approve");
                  }}
                  loading={loading}
                  disabled={loading}
                />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}

      {/**
       * Global processing dialog shown while the approve/reject request is in progress.
       * It's intentionally non-dismissible to prevent duplicate actions.
       */}
      {loading && (
        <Dialog
          header="Processing"
          id="processing-dialog"
          // no-op close so the dialog can't be dismissed while loading
          onClose={() => {}}
          zOffset={2000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={3}>
              <Text size={2}>Processing request…</Text>
              <Text size={1}>
                This may take a few moments. Please wait — do not close this
                dialog.
              </Text>
            </Stack>
          </Box>
        </Dialog>
      )}
    </>
  );
}

export default ApproveTenantButton;
