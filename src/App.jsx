import { Table, Card, Modal, Button, Input, Form, Radio, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import 'antd/dist/reset.css';
import 'antd-css-utilities/utility.min.css'
import { useState } from 'react'
import './App.css';



function App() {
  
    //SET CURRENT DATE FORMAT
  
    const formatDate = () => {
      const dateString = Date.now();
      const options = { year: "numeric", month: "numeric", day: "numeric" }
      let date = new Date(dateString).toLocaleDateString("af-ZA", options)
      return date.replaceAll('/', '-')
    }  
    const FinalDate = formatDate();
  
  //SET DEFAULT NOTES
  
  const defaultNotes = { key: '', timeStamps: FinalDate, title: '', description: '', dueDate: '', tag: '', status: 'OPEN' };
  const defaultEditedNote = { editedkey: '', editedtimeStamps: '', editedtitle: '', editeddescription: '', editeddueDate: '', editedtag: '', editedstatus: '' };
  
  

  //ALL STATES

  const [page, setpage] = useState(1);
  const [pageSize, setpageSize] = useState(10);
  const [form] = Form.useForm();
  let [key, setKey] = useState(1);
  const [data, setData] = useState([]);
  const [note, setNote] = useState(defaultNotes);
  const [editedNote, setEditedNote] = useState(defaultEditedNote);
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('');
  const [filteredData, setfilteredData] = useState('');





  // COVERT TAG INTO ARRAY SEPERATED BY COMMA  AND REMOVE DUPLICATE TAGS

  const seperateTags = (string) => {
    const array = string.split(",").map((item, i) => item);

    function removeDuplicates(array) {
      var unique = [];
      array.forEach(element => {
        if (!unique.includes(element)) {
          unique.push(element);
        }
      });
      return unique;
    }
    return removeDuplicates(array);
  }

  //REMOVE BLANK SPACE FROM STRING

  const removeBlankSpace = (str) => {

    let onlyCharacters = str.replaceAll(" ", "");
    return onlyCharacters;
  }



  //DELETING CURRENT NOTE
  const onDeleteNote = (currentNote) => {
    const dataAfterDeletingNote = data.filter(note => note.key !== currentNote.key)
    Modal.confirm({
      title: "Are you sure,want to delete this To-do",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setData(dataAfterDeletingNote);
        setfilteredData(dataAfterDeletingNote)
      }
    });
  }


  //ADDING NEW NOTE

  const showModal = () => {
    form.resetFields();
    setNote(defaultNotes)
    setOpen(true);
  }

  const onChangeAddNote = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }

  const handleOk = (e) => {
    form.submit();
  }

  const onFinish = (e) => {
    const { timeStamps, title, description, dueDate, tag, status } = note;
    setKey(key + 1)
    const newNote = { key: key, timeStamps: timeStamps, title: title, description: description, dueDate: dueDate, tag: seperateTags(tag), status: status };
    setData(data.concat(newNote))
    setfilteredData(filteredData.concat(newNote))
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false);
  }

  //EDIT CURRENT NOTE
  const [isEditing, setIsEditing] = useState(false);

  const onEditNote = (record) => {
    setIsEditing(true);
    const data = { editedkey: record.key, editedtimeStamps: record.timeStamps, editedtitle: record.title, editeddescription: record.description, editeddueDate: record.dueDate, editedtag: record.tag.toString(), editedstatus: record.status }
    setEditedNote(data);
  };
  const onChangeEditNote = (e) => {
    setEditedNote({ ...editedNote, [e.target.name]: e.target.value })
  }
  const resetEditing = () => {
    setIsEditing(false);
    setEditedNote(null);
  };

  //REMOVING SEARCH FILTER
  const cancelSearch = () => {
    setValue('')
    setfilteredData('')
  }


  const columns = [
    {
      title: 'Time Stamps',
      dataIndex: 'timeStamps',
      key: '1',
      sorter: (row1, row2) => {
        return row1.key > row2.key
      },


    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: '2',
      filteredValue: ['hi'],
      sorter: (row1, row2) => {
        return row1.key > row2.key
      },

    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: '3',
      sorter: (row1, row2) => {
        return row1.key > row2.key
      }
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: '4',
      sorter: (row1, row2) => {
        return row1.key > row2.key
      }
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: '5',
      render: (tags) => {
        return (
          <>
            {tags.map((tag) => {
              return <Tag color="blue" key={tag}>
                {tag}
              </Tag>
            })}
          </>
        );
      }

    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: '6',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record, index) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditNote(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteNote(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];


  return (
    <>
      <Card className="container">

           <h1 className='text-center' style={{ fontFamily: 'Arial'}}> To Do List</h1>
        

        <Input className='py-2' placeholder='Search Here...' style={{ marginBottom: 8 }}
          value={value}
          onChange={e => {
            {
              const currValue = e.target.value;
              setValue(removeBlankSpace(currValue));
              const fData = data.filter((entry) => {
                return (
                  entry.title.toLowerCase().includes(currValue.toLowerCase()) ||
                  entry.timeStamps.toLowerCase().includes(currValue.toLowerCase()) ||
                  entry.description.toLowerCase().includes(currValue.toLowerCase()) ||
                  entry.tag.toString().toLowerCase().includes(currValue.toLowerCase()) ||
                  entry.dueDate.toLowerCase().includes(currValue.toLowerCase()) ||
                  entry.status.toLowerCase().includes(currValue.toLowerCase())

                )
              });
              setfilteredData(fData);
            }
          }
          }
          suffix={<CloseOutlined onClick={cancelSearch} />}
        />
        <Table

          dataSource={filteredData && value !== '' ? filteredData : data}
          columns={columns}
          pagination={{
            current: page,
            pageSize: pageSize,
            onChange: (page, pageSize) => {
              setpage(page);
              setpageSize(pageSize)
            }
          }}
        />
        <Button className='ml-8 ' type="primary" onClick={showModal}>
          Add To Do
        </Button>
      </Card>


      {/* MODAL FOR ADD NOTE */}
      <Modal
        title="Add New To Do"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}

        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >

        <Form
          form={form}
          initialValues={{ status: 'OPEN' }}
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{
            maxWidth: 600,
          }}
          onFinish={onFinish}>
          <Form.Item
            name='title'
            label="Title"
            rules={[
              {
                required: true,
                message: "Please enter Title",
              },
              { max: 100 },
            ]}
          >
            <Input placeholder='title' name='title' onChange={onChangeAddNote} value={note.title} />
          </Form.Item>
          <Form.Item
            name='description'
            label="Description"
            rules={[
              {
                required: true,
                message: "Please enter Description",
              },
              { max: 1000 },
            ]}
          >
            <Input placeholder='description' name='description' onChange={onChangeAddNote} value={note.description} />
          </Form.Item>
          <Form.Item name='dueDate' label="Due Date"
            requiredMark="optional"
          >
            <Input placeholder='dueDate' type='date' name='dueDate' onChange={onChangeAddNote} value={note.dueDate} />
          </Form.Item>
          <Form.Item name='tag' label="Tag"
            requiredMark="optional">
            <Input placeholder='tag' name='tag' onChange={onChangeAddNote} value={note.tag} />
          </Form.Item>
          <Form.Item name='status' label="Status"
            rules={[
              {
                required: true,
                message: "Please enter Description",
              }
            ]}>
            <Radio.Group name='status' onChange={onChangeAddNote} >
              <Radio value="OPEN"  > OPEN </Radio>
              <Radio value="WORKING"  > WORKING </Radio>
              <Radio value="DONE"  > DONE</Radio>
              <Radio value="OVERDUE"  > OVERDUE</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>

      </Modal>


      {/* MODAL FOR EDIT NOTE */}
      <Modal
        title="Edit To Do"
        open={isEditing}
        okText="Save"
        onCancel={() => {
          resetEditing();
        }}
        onOk={() => {
          setData((pre) => {
            return pre.map((note) => {
              if (note.key === editedNote.editedkey) {
                const { editedkey, editedtitle, editedtimeStamps, editeddescription, editeddueDate, editedtag, editedstatus } = editedNote;
                const replaceEditedNote = ({ key: editedkey, timeStamps: editedtimeStamps, title: editedtitle, description: editeddescription, dueDate: editeddueDate, tag: seperateTags(editedtag), status: editedstatus })
                return replaceEditedNote;
              } else {
                return note;
              }
            });
          });
          setValue('')
          resetEditing();
        }}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{
            maxWidth: 600,
          }}>
          <Form.Item
            label="Title"
            rules={[
              {
                required: true,
                message: "Please enter Title",
              },
              { max: 100 },
            ]}>
            <Input name='editedtitle' onChange={onChangeEditNote} value={editedNote?.editedtitle} />
          </Form.Item>
          <Form.Item
            label="Description"
            rules={[
              {
                required: true,
                message: "Please enter Description",
              },
              { max: 1000 },
            ]}>
            <Input name='editeddescription' onChange={onChangeEditNote} value={editedNote?.editeddescription} />
          </Form.Item>
          <Form.Item label="Due Date"
            requiredMark="optional"
          >
            <Input type='date' name='editeddueDate' onChange={onChangeEditNote} value={editedNote?.editeddueDate} />
          </Form.Item>
          <Form.Item label="Tag">
            <Input name='editedtag' onChange={onChangeEditNote} value={editedNote?.editedtag} />
          </Form.Item>
          <Form.Item label="Status">
            <Radio.Group name='editedstatus' onChange={onChangeEditNote} >
              <Radio value="OPEN"   > OPEN </Radio>
              <Radio value="WORKING"  > WORKING </Radio>
              <Radio value="DONE"  > DONE</Radio>
              <Radio value="OVERDUE"  > OVERDUE</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>

      </Modal>

    </>
  )
}

export default App
