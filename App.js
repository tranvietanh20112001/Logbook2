import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Appbar,
  FAB,
  TextInput,
  Button,
  List,
  Dialog,
  Portal,
  Text,
  Provider as PaperProvider,
} from 'react-native-paper';
import uuid from 'react-native-uuid';

const App = () => {
  const [nhiemvu, setnhiemvu] = useState([]);
  const [hienthiDialog, sethienthiDialog] = useState(false);
  const [nhiemvuHientai, setnhiemvuHientai] = useState({ id: null, tenTask: '' });

  const luuNhiemvu = () => {
    if (!nhiemvuHientai.tenTask.trim()) {
      Alert.alert('Validation', 'Task name cannot be empty.');
      return;
    }
    if (nhiemvuHientai.id) {
      setnhiemvu((prevnhiemvu) =>
        prevnhiemvu.map((nhiemvu) =>
          nhiemvu.id === nhiemvuHientai.id ? { ...nhiemvu, tenTask: nhiemvuHientai.tenTask } : nhiemvu
        )
      );
    } else {
      setnhiemvu((prevnhiemvu) => [
        ...prevnhiemvu,
        { id: uuid.v4(), tenTask: nhiemvuHientai.tenTask },
      ]);
    }
    setnhiemvuHientai({ id: null, tenTask: '' });
    sethienthiDialog(false);
  };

  const handleOpenDialog = (nhiemvu = { id: null, tenTask: '' }) => {
    setnhiemvuHientai(nhiemvu);
    sethienthiDialog(true);
  };

  const handleDeleteTask = (id) => {
    setnhiemvu((prevnhiemvu) => prevnhiemvu.filter((task) => task.id !== id));
  };

  return (
    <PaperProvider>
      <View style={styles.containerStyle}>
        <Appbar.Header>
          <Appbar.Content title="Task Manager" />
        </Appbar.Header>

        <FlatList
          data={nhiemvu}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.tenTask}
              right={(props) => (
                <View style={styles.actionButtonsStyle}>
                  <Button
                    mode="text"
                    compact
                    onPress={() => handleOpenDialog(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    mode="text"
                    compact
                    color="red"
                    onPress={() => handleDeleteTask(item.id)}
                  >
                    Delete
                  </Button>
                </View>
              )}
              style={styles.taskItemStyle}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyStateStyle}>No tasks found.</Text>
          }
        />

        <FAB
          style={styles.fabStyle}
          icon="plus"
          label="Add Task"
          onPress={() => handleOpenDialog()}
        />

        <Portal>
          <Dialog visible={hienthiDialog} onDismiss={() => sethienthiDialog(false)}>
            <Dialog.Title>
              {nhiemvuHientai.id ? 'Edit Task' : 'Add Task'}
            </Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Task Name"
                mode="outlined"
                value={nhiemvuHientai.tenTask}
                onChangeText={(text) =>
                  setnhiemvuHientai((prev) => ({ ...prev, tenTask: text }))
                }
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => sethienthiDialog(false)}>Cancel</Button>
              <Button onPress={luuNhiemvu}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  taskItemStyle: {
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  actionButtonsStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fabStyle: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyStateStyle: {
    textAlign: 'center',
    marginTop: 20,
    color: '#AAA',
  },
});

export default App;
